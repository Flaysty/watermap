# # ───────────────────────── Imports ─────────────────────────
# import pandas as pd
# import numpy as np
# import matplotlib.pyplot as plt
# from sklearn.linear_model import LinearRegression

# # tqdm (auto-install if missing)
# import sys, subprocess, importlib
# try:
#     from tqdm import tqdm
# except ImportError:
#     subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "tqdm"])
#     from tqdm import tqdm

# # ───────────────────────── Take source DF ─────────────────────────
# source_df: pd.DataFrame = dataframes_list[0].copy()

# # ───────────────────────── Auto-detect columns ─────────────────────────
# date_column: str = next((c for c in source_df.columns if "Дата" in str(c)), source_df.columns[0])
# hour_column: str = next((c for c in source_df.columns if "сут" in str(c) or "Время" in str(c)), source_df.columns[1])

# # ───────────────────────── Parse date & hour ─────────────────────────
# df: pd.DataFrame = source_df.copy()[:300] #<<<<<<<<< ПОДРЕЗАЛ ДАТАСЕТ!!!!
# df["date"] = pd.to_datetime(df[date_column], dayfirst=True, errors="coerce")

# # Turn "0-1" -> 0, "13:00" -> 13, etc.
# df["hour_start"] = (
#     df[hour_column].astype(str)
#     .str.extract(r"^\s*(\d+)")
#     .iloc[:, 0]
#     .astype(float)
#     .astype(int)
# )

# # Datetime for x-axis
# df["datetime_start"] = df["date"] + pd.to_timedelta(df["hour_start"], unit="h")

# # ───────────────────────── Detect numeric columns ─────────────────────────
# helper_columns = {date_column, hour_column, "date", "hour_start", "datetime_start"}
# candidate_columns = [c for c in df.columns if c not in helper_columns]

# float_columns: list[str] = []
# int_columns: list[str] = []

# for column_name in candidate_columns:
#     numeric_series = pd.to_numeric(df[column_name], errors="coerce")
#     df[column_name] = numeric_series
#     non_na = numeric_series.dropna()
#     if non_na.empty:
#         continue
#     if np.isclose(non_na % 1, 0).all():
#         int_columns.append(column_name)
#     else:
#         float_columns.append(column_name)

# if not float_columns:
#     raise ValueError("No float-like columns found to forecast.")

# # ───────────────────────── Choose target for forecasting ─────────────────────────
# preferred_targets = [c for c in float_columns if "подача" in str(c).lower()]
# target_column: str = preferred_targets[0] if preferred_targets else float_columns[0]

# # ───────────────────────── Prepare for plotting ─────────────────────────
# df_indexed = df.set_index(["hour_start", "date"])
# df_plot = df.sort_values("datetime_start").reset_index(drop=True)

# # ───────────────────────── Plot: floats (left Y), integers (right Y) ─────────────────────────
# fig, ax_left = plt.subplots(figsize=(14, 6))
# ax_right = ax_left.twinx()

# for col in float_columns:
#     ax_left.plot(df_plot["datetime_start"], df_plot[col], label=col, linewidth=1.8)

# for col in int_columns:
#     ax_right.plot(df_plot["datetime_start"], df_plot[col].astype(float), linestyle="--", label=col, linewidth=1.8)

# ax_left.set_title("Hourly metrics — float vs integer (chronological X)")
# ax_left.set_xlabel("Datetime (hour start)")
# ax_left.set_ylabel("Float values (left Y)")
# ax_right.set_ylabel("Integer values (right Y)")
# plt.setp(ax_left.get_xticklabels(), rotation=45, ha="right")

# # ───────────────────────── Linear Regression forecast (next 24 hours) ─────────────────────────
# def build_time_features(dt_series: pd.Series, values_series: pd.Series) -> pd.DataFrame:
#     features = pd.DataFrame(index=dt_series.index)
#     features["time_index"] = np.arange(len(dt_series))
#     features["hour_of_day"] = dt_series.dt.hour
#     features["day_of_week"] = dt_series.dt.dayofweek
#     features["sin_hour"] = np.sin(2 * np.pi * features["hour_of_day"] / 24)
#     features["cos_hour"] = np.cos(2 * np.pi * features["hour_of_day"] / 24)
#     features["lag_1"] = values_series.shift(1)
#     features["lag_24"] = values_series.shift(24)
#     features["roll_mean_24"] = values_series.rolling(window=24, min_periods=1).mean()
#     return features

# target_values_full: pd.Series = df_plot[target_column]
# datetime_series_full: pd.Series = df_plot["datetime_start"]

# features_full = build_time_features(datetime_series_full, target_values_full)
# train_mask = features_full[["lag_1", "lag_24"]].notna().all(axis=1) & target_values_full.notna()
# X_train = features_full.loc[train_mask]
# y_train = target_values_full.loc[train_mask]

# linear_model = LinearRegression()
# linear_model.fit(X_train, y_train)

# forecast_horizon_hours: int = 24
# last_dt: pd.Timestamp = datetime_series_full.iloc[-1]
# last_time_index: int = int(features_full["time_index"].iloc[-1])

# extended_values = target_values_full.dropna().tolist()
# forecast_datetimes: list[pd.Timestamp] = []
# forecast_values: list[float] = []

# with tqdm(total=forecast_horizon_hours, desc=f"Forecast {target_column}", unit="hour") as progress_bar:
#     for step in range(1, forecast_horizon_hours + 1):
#         future_dt = last_dt + pd.Timedelta(hours=step)
#         future_time_index = last_time_index + step
#         hour_of_day = future_dt.hour
#         day_of_week = future_dt.dayofweek
#         sin_hour = np.sin(2 * np.pi * hour_of_day / 24)
#         cos_hour = np.cos(2 * np.pi * hour_of_day / 24)

#         lag_1 = extended_values[-1]
#         lag_24 = extended_values[-24] if len(extended_values) >= 24 else lag_1
#         roll_mean_24 = np.mean(extended_values[-24:]) if len(extended_values) >= 1 else lag_1

#         X_future_row = pd.DataFrame(
#             {
#                 "time_index": [future_time_index],
#                 "hour_of_day": [hour_of_day],
#                 "day_of_week": [day_of_week],
#                 "sin_hour": [sin_hour],
#                 "cos_hour": [cos_hour],
#                 "lag_1": [lag_1],
#                 "lag_24": [lag_24],
#                 "roll_mean_24": [roll_mean_24],
#             }
#         )

#         y_future_pred = float(linear_model.predict(X_future_row)[0])
#         extended_values.append(y_future_pred)
#         forecast_datetimes.append(future_dt)
#         forecast_values.append(y_future_pred)

#         progress_bar.set_postfix_str(f"{future_dt:%Y-%m-%d %H}: {y_future_pred:.3f}")
#         progress_bar.update(1)

# # ───────────────────────── Plot forecast ─────────────────────────
# # Явно отличимым цветом и стилем
# ax_left.plot(
#     forecast_datetimes,
#     forecast_values,
#     label=f"{target_column} — forecast (next 24h, LinearRegression)",
#     linewidth=2.8,
#     color="black",
#     linestyle="-."
# )

# handles_left, labels_left = ax_left.get_legend_handles_labels()
# handles_right, labels_right = ax_right.get_legend_handles_labels()
# ax_left.legend(handles_left + handles_right, labels_left + labels_right, loc="upper left", ncol=2)

# ax_left.grid(True, alpha=0.3)
# fig.tight_layout()
# plt.show()

# # ───────────────────────── Sanity output ─────────────────────────
# print("Index levels (df_indexed):", df_indexed.index.names)
# print("Float columns:", float_columns)
# print("Integer-like columns:", int_columns)
# print(f"Target column for forecast: {target_column}")
# print(f"Forecast horizon (hours): {forecast_horizon_hours}")
# print(f"Forecast start: {forecast_datetimes[0] if forecast_datetimes else 'n/a'}  |  "
#       f"end: {forecast_datetimes[-1] if forecast_datetimes else 'n/a'}")
