# ───────────────────────── Imports ─────────────────────────
import pandas as pd
import numpy as np
#import matplotlib.pyplot as plt


def IntradayAnalytics(dataframes_list):
    # ───────────────────────── Take source DF ─────────────────────────
    source_df: pd.DataFrame = dataframes_list.copy()

    # ───────────────────────── Auto-detect columns ─────────────────────────
    date_column: str = next((c for c in source_df.columns if "Дата" in str(c)), source_df.columns[0])
    hour_column: str = next((c for c in source_df.columns if "сут" in str(c) or "Время" in str(c)), source_df.columns[1])

    # ───────────────────────── Parse date & hour ─────────────────────────
    df: pd.DataFrame = source_df.copy()
    df["date"] = pd.to_datetime(df[date_column], dayfirst=True, errors="coerce")

    # "0-1" -> 0
    df["hour_start"] = (
        df[hour_column].astype(str)
        .str.extract(r"^\s*(\d+)")
        .iloc[:, 0]
        .astype(float)
        .astype(int)
    )

    # datetime for plotting
    df["datetime_start"] = df["date"] + pd.to_timedelta(df["hour_start"], unit="h")

    # ───────────────────────── Detect numeric columns ─────────────────────────
    helper_columns = {date_column, hour_column, "date", "hour_start", "datetime_start"}
    candidate_columns = [c for c in df.columns if c not in helper_columns]

    float_columns: list[str] = []
    int_columns: list[str] = []

    for column_name in candidate_columns:
        numeric_series = pd.to_numeric(df[column_name], errors="coerce")
        df[column_name] = numeric_series  # keep numeric version
        non_na = numeric_series.dropna()
        if non_na.empty:
            continue
        # integer-like if values are whole numbers
        if np.isclose(non_na % 1, 0).all():
            int_columns.append(column_name)
        else:
            float_columns.append(column_name)

    # ───────────────────────── Set required MultiIndex (hour, date) ─────────────────────────
    df_indexed = df.set_index(["hour_start", "date"])  # keep original structure (no sort)

    # ───────────────────────── Build time-sorted frame for plotting ─────────────────────────
    df_plot = df.sort_values("datetime_start").reset_index(drop=True)

    '''
    # ───────────────────────── Plot 1: floats (left Y), integers (right Y) ─────────────────────────
    fig, ax_left = plt.subplots(figsize=(14, 6))
    ax_right = ax_left.twinx()

    # Float series on the left axis
    for col in float_columns:
        ax_left.plot(df_plot["datetime_start"], df_plot[col], label=col, linewidth=1.8)

    # Integer-like series on the right axis (dashed)
    for col in int_columns:
        ax_right.plot(df_plot["datetime_start"], df_plot[col].astype(float), linestyle="--", label=col, linewidth=1.8)

    ax_left.set_title("Hourly metrics — float vs integer (chronological X)")
    ax_left.set_xlabel("Datetime (hour start)")
    ax_left.set_ylabel("Float values (left Y)")
    ax_right.set_ylabel("Integer values (right Y)")

    plt.setp(ax_left.get_xticklabels(), rotation=45, ha="right")

    # Merge legends from both axes
    handles_left, labels_left = ax_left.get_legend_handles_labels()
    handles_right, labels_right = ax_right.get_legend_handles_labels()
    ax_left.legend(handles_left + handles_right, labels_left + labels_right, loc="upper left", ncol=2)

    ax_left.grid(True, alpha=0.3)
    fig.tight_layout()
    plt.show()
    '''



    # ───────────────────────── Plot 2: Hour-of-day means — bars with spread ─────────────────────────
    # Aggregation per hour: mean + 10/90 percentiles (asymmetric error bars)
    numeric_columns: list[str] = float_columns + int_columns
    if len(numeric_columns) == 0:
        raise RuntimeError("No numeric columns detected to aggregate by hour.")


    # Исторические данные
    historical_data = [
        {
            "datetime": row["datetime_start"].strftime("%Y-%m-%dT%H:%M:%S"),
            "values": {col: row[col] for col in numeric_columns if pd.notna(row[col])}
        }
        for _, row in df_plot.iterrows()
    ]

    # prepare grouped stats
    group_obj = df.groupby("hour_start")[numeric_columns]
    hourly_mean: pd.DataFrame = group_obj.mean()
    hourly_p10: pd.DataFrame = group_obj.quantile(0.10)
    hourly_p90: pd.DataFrame = group_obj.quantile(0.90)

    # Ensure full 0..23 index order
    full_hours_index = pd.Index(np.arange(0, 24), name="hour_start")
    hourly_mean = hourly_mean.reindex(full_hours_index)
    hourly_p10 = hourly_p10.reindex(full_hours_index)
    hourly_p90 = hourly_p90.reindex(full_hours_index)

    # Формирование агрегированных данных
    hourly_aggregates = [
        {
            "hour": int(hour),
            "values": {
                col: {
                    "mean": hourly_mean[col][hour] if pd.notna(hourly_mean[col][hour]) else None,
                    "p10": hourly_p10[col][hour] if pd.notna(hourly_p10[col][hour]) else None,
                    "p90": hourly_p90[col][hour] if pd.notna(hourly_p90[col][hour]) else None
                }
                for col in numeric_columns
            }
        }
        for hour in full_hours_index
    ]

    # Формирование JSON
    result = {
        "columns": [
            {"name": col, "type": "float" if col in float_columns else "int"}
            for col in numeric_columns
        ],
        "historical_data": historical_data,
        "hourly_aggregates": hourly_aggregates
    }

    return result



    '''
    def plot_grouped_bars_with_percentile_spread(
        means_df: pd.DataFrame,
        p10_df: pd.DataFrame,
        p90_df: pd.DataFrame,
        title_text: str
    ) -> None:
        """
        Draw grouped bar chart with asymmetric error bars (10–90 percentile spread).
        Each column becomes its own bar group across hours 0..23.
        """
        if means_df.empty:
            print(f"Skip plot: no columns to draw for '{title_text}'.")
            return

        hours_list: np.ndarray = means_df.index.to_numpy()
        num_hours: int = len(hours_list)
        num_series: int = means_df.shape[1]

        x_centers = np.arange(num_hours)
        bar_width: float = 0.8 / max(num_series, 1)

        fig, ax = plt.subplots(figsize=(14, 6))
        for i, col in enumerate(means_df.columns):
            x_positions = x_centers - 0.4 + bar_width * (i + 0.5)
            y_values = means_df[col].to_numpy()

            # Asymmetric errors: lower = mean - p10, upper = p90 - mean
            err_lower = (means_df[col] - p10_df[col]).to_numpy()
            err_upper = (p90_df[col] - means_df[col]).to_numpy()
            yerr = np.vstack([err_lower, err_upper])

            ax.bar(
                x_positions,
                y_values,
                width=bar_width,
                label=col,
                yerr=yerr,
                capsize=3,
                linewidth=0.5
            )

        ax.set_title(title_text + " — grouped bars with 10–90 percentile spread")
        ax.set_xlabel("Hour of day (start)")
        ax.set_ylabel("Mean value")
        ax.set_xticks(x_centers)
        ax.set_xticklabels(hours_list.astype(int))
        ax.legend(loc="upper right", ncol=2)
        ax.grid(True, axis="y", alpha=0.3)
        fig.tight_layout()
        plt.show()

    # Floats: bars with spread
    plot_grouped_bars_with_percentile_spread(
        hourly_mean[float_columns],
        hourly_p10[float_columns],
        hourly_p90[float_columns],
        title_text="Hourly averages — float columns"
    )

    # Integers: bars with spread (cast to float for plotting if needed)
    plot_grouped_bars_with_percentile_spread(
        hourly_mean[int_columns].astype(float),
        hourly_p10[int_columns].astype(float),
        hourly_p90[int_columns].astype(float),
        title_text="Hourly averages — integer-like columns"
    )
    '''
    # ───────────────────────── Sanity output ─────────────────────────
    '''
    print("Index levels (df_indexed):", df_indexed.index.names)
    print("Float columns:", float_columns)
    print("Integer-like columns:", int_columns)
    print("\nHourly mean (first rows):")
    display(hourly_mean.head())
    '''
