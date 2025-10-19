# ───────────────────────── Imports ─────────────────────────
import pandas as pd
import numpy as np
#import matplotlib.pyplot as plt
#from tqdm import tqdm
from sklearn.linear_model import LinearRegression


def LR_prediction(dataframes_list):

    # ───────────────────────── Take source DF ─────────────────────────
    source_df: pd.DataFrame = dataframes_list.copy()
    # ───────────────────────── Auto-detect columns ─────────────────────────
    date_column: str = next((c for c in source_df.columns if "Дата" in str(c)), source_df.columns[0])
    hour_column: str = next((c for c in source_df.columns if "сут" in str(c) or "Время" in str(c)), source_df.columns[1])

    # ───────────────────────── Parse date & hour ─────────────────────────
    df: pd.DataFrame = source_df.copy()[:300] #<<<<<<<<<<<< ПОДРЕЗАНА ЧАСТЬ ДАТАСЕТА
    df["date"] = pd.to_datetime(df[date_column], dayfirst=True, errors="coerce")

    # Normalize hour like "0-1" -> 0, "13:00" -> 13, etc.
    df["hour_start"] = (
        df[hour_column].astype(str)
        .str.extract(r"^\s*(\d+)")
        .iloc[:, 0]
        .astype(float)
        .astype(int)
    )

    # Datetime for plotting
    df["datetime_start"] = df["date"] + pd.to_timedelta(df["hour_start"], unit="h")
    ###
    #df["datetime_start"] = df["datetime_start"].dt.strftime("%Y-%m-%dT%H:%M:%S")

    # ───────────────────────── Detect numeric columns ─────────────────────────
    helper_columns = {date_column, hour_column, "date", "hour_start", "datetime_start"}
    candidate_columns = [c for c in df.columns if c not in helper_columns]

    float_columns: list[str] = []
    int_columns: list[str] = []

    for column_name in candidate_columns:
        numeric_series = pd.to_numeric(df[column_name], errors="coerce")
        df[column_name] = numeric_series
        non_na = numeric_series.dropna()
        if non_na.empty:
            continue
        if np.isclose(non_na % 1, 0).all():
            int_columns.append(column_name)
        else:
            float_columns.append(column_name)

    if not (float_columns or int_columns):
        raise ValueError("No numeric columns found for plotting and forecasting.")

    # ───────────────────────── Prepare frames ─────────────────────────
    df_indexed = df.set_index(["hour_start", "date"])  # keep structure
    df_plot = df.sort_values("datetime_start").reset_index(drop=True)
    ###
    all_numeric_columns = float_columns + int_columns

    # --- Исторические данные ---
    historical_data = [
        {
            "datetime": row["datetime_start"].strftime("%Y-%m-%dT%H:%M:%S"),
            "values": {col: row[col] for col in all_numeric_columns if pd.notna(row[col])}
        }
        for _, row in df_plot.iterrows()
    ]

    '''
    # ───────────────────────── Plot history ─────────────────────────
    fig, ax_left = plt.subplots(figsize=(14, 6))
    ax_right = ax_left.twinx()

    # Remember plotted line styles/colors to reuse for forecast
    series_plot_info: dict[str, dict] = {}

    # Float series (solid)
    for col in float_columns:
        line = ax_left.plot(df_plot["datetime_start"], df_plot[col], label=col, linewidth=1.8)[0]
        series_plot_info[col] = {
            "axis": ax_left,
            "color": line.get_color(),
            "history_linestyle": line.get_linestyle(),  # usually '-'
        }

    # Integer-like series (dashed)
    for col in int_columns:
        line = ax_right.plot(df_plot["datetime_start"], df_plot[col].astype(float),
                             linestyle="--", label=col, linewidth=1.8)[0]
        series_plot_info[col] = {
            "axis": ax_right,
            "color": line.get_color(),
            "history_linestyle": line.get_linestyle(),  # '--'
        }

    ax_left.set_title("Hourly metrics — float vs integer (chronological X)")
    ax_left.set_xlabel("Datetime (hour start)")
    ax_left.set_ylabel("Float values (left Y)")
    ax_right.set_ylabel("Integer values (right Y)")
    plt.setp(ax_left.get_xticklabels(), rotation=45, ha="right")

    # ───────────────────────── Helpers for LR forecast ─────────────────────────
    '''

    def build_time_features(dt_series: pd.Series, values_series: pd.Series) -> pd.DataFrame:
        """Create regression features aligned to dt_series index."""
        features = pd.DataFrame(index=dt_series.index)
        features["time_index"] = np.arange(len(dt_series))
        features["hour_of_day"] = dt_series.dt.hour
        features["day_of_week"] = dt_series.dt.dayofweek
        features["sin_hour"] = np.sin(2 * np.pi * features["hour_of_day"] / 24)
        features["cos_hour"] = np.cos(2 * np.pi * features["hour_of_day"] / 24)
        features["lag_1"] = values_series.shift(1)
        features["lag_24"] = values_series.shift(24)
        features["roll_mean_24"] = values_series.rolling(window=24, min_periods=1).mean()
        return features
    '''
    def pick_forecast_style(history_linestyle: str) -> dict:
        """Return linestyle/linewidth for forecast given history style."""
        ls = history_linestyle or "-"
        if ls in ("-", "solid"):
            return {"linestyle": "-.", "linewidth": 2.6}
        if ls in ("--", "dashed"):
            return {"linestyle": ":", "linewidth": 2.6}
        # fallback
        return {"linestyle": "-.", "linewidth": 2.6}
    '''


    # ───────────────────────── Forecast for ALL numeric columns ─────────────────────────
    forecast_horizon_hours: int = 24*4 ##<<<<<<<<<<<<< Горизонт прогноза
    datetime_series_full: pd.Series = df_plot["datetime_start"]
    last_dt: pd.Timestamp = datetime_series_full.iloc[-1]
    forecast_data = []

    #all_numeric_columns: list[str] = float_columns + int_columns

    #for col in tqdm(all_numeric_columns, desc="Forecasting all series", unit="series"):
    for col in all_numeric_columns:
        values_series: pd.Series = df_plot[col]

        features_full = build_time_features(datetime_series_full, values_series)
        train_mask = features_full[["lag_1", "lag_24"]].notna().all(axis=1) & values_series.notna()

        if train_mask.sum() < 5:
            # слишком мало точек для осмысленной регрессии — пропустим колонку
            continue

        X_train = features_full.loc[train_mask]
        y_train = values_series.loc[train_mask]

        model = LinearRegression()
        model.fit(X_train, y_train)

        # Recursive 24h forecast
        extended_values = values_series.dropna().tolist()
        forecast_datetimes: list[pd.Timestamp] = []
        forecast_values: list[float] = []

        for step in range(1, forecast_horizon_hours + 1):
            future_dt = last_dt + pd.Timedelta(hours=step)
            future_time_index = int(features_full["time_index"].iloc[-1]) + step
            hour_of_day = future_dt.hour
            day_of_week = future_dt.dayofweek
            sin_hour = np.sin(2 * np.pi * hour_of_day / 24)
            cos_hour = np.cos(2 * np.pi * hour_of_day / 24)

            lag_1 = extended_values[-1]
            lag_24 = extended_values[-24] if len(extended_values) >= 24 else lag_1
            roll_mean_24 = np.mean(extended_values[-24:]) if len(extended_values) >= 1 else lag_1

            X_future_row = pd.DataFrame(
                {
                    "time_index": [future_time_index],
                    "hour_of_day": [hour_of_day],
                    "day_of_week": [day_of_week],
                    "sin_hour": [sin_hour],
                    "cos_hour": [cos_hour],
                    "lag_1": [lag_1],
                    "lag_24": [lag_24],
                    "roll_mean_24": [roll_mean_24],
                }
            )

            y_future_pred = float(model.predict(X_future_row)[0])
            extended_values.append(y_future_pred)
            # forecast_datetimes.append(future_dt)
            forecast_datetimes.append(future_dt.strftime("%Y-%m-%dT%H:%M:%S"))
            forecast_values.append(y_future_pred)

        #  Сохраняем прогноз для колонки
        for i in range(len(forecast_datetimes)):
            if not forecast_data or len(forecast_data) <= i:
                forecast_data.append({"datetime": forecast_datetimes[i], "values": {}})
            forecast_data[i]["values"][col] = forecast_values[i]

    # --- Формирование JSON ---
    result = {
        "columns": [
            {"name": col, "type": "float" if col in float_columns else "int"}
            for col in all_numeric_columns
        ],
        "historical_data": historical_data,
        "forecast_data": forecast_data
    }
    return result

'''
    # Plot forecast using SAME color as history, only style/thickness differ
    axis_for_series = series_plot_info[col]["axis"]
    color_for_series = series_plot_info[col]["color"]
    history_ls = series_plot_info[col]["history_linestyle"]
    style_kwargs = pick_forecast_style(history_ls)

    axis_for_series.plot(
        forecast_datetimes,
        forecast_values,
        label=f"{col} — forecast (next 24h)",
        color=color_for_series,
        **style_kwargs,
        zorder=5,
    )

# ───────────────────────── Legend / finalize ─────────────────────────
handles_left, labels_left = ax_left.get_legend_handles_labels()
handles_right, labels_right = ax_right.get_legend_handles_labels()
ax_left.legend(handles_left + handles_right, labels_left + labels_right, loc="upper left", ncol=2)

ax_left.grid(True, alpha=0.3)
fig.tight_layout()
plt.show()

# ───────────────────────── Sanity output ─────────────────────────
'''


'''
print("Index levels (df_indexed):", df_indexed.index.names)
print("Float columns:", float_columns)
print("Integer-like columns:", int_columns)
print(f"Forecast horizon (hours): {forecast_horizon_hours}")
print(f"Forecast period: {last_dt + pd.Timedelta(hours=1)}  →  {last_dt + pd.Timedelta(hours=forecast_horizon_hours)}")
'''
