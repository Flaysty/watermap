# ───────────────────────── Imports ─────────────────────────
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


def Visualization(dataframes_list):
    # ───────────────────────── Take source DF ─────────────────────────
    #source_df: pd.DataFrame = dataframes_list[0].copy()

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
    df_indexed = df.set_index(["hour_start", "date"])  # не сортируем индекс для сохранения структуры

    # ───────────────────────── Build time-sorted frame for plotting ─────────────────────────
    df_plot = df.sort_values("datetime_start").reset_index(drop=True)


    # ───────────────────────── подготавливаем данные для API ─────────────────────────
    data_for_api = {
        "datetime_start": df_plot["datetime_start"].dt.strftime("%Y-%m-%d %H:%M:%S").tolist(),  # Преобразуем даты в строки
        "float_columns": {col: df_plot[col].tolist() for col in float_columns},  # Данные для float-столбцов
        "int_columns": {col: df_plot[col].tolist() for col in int_columns},      # Данные для int-столбцов
        "metadata": {
            "float_columns": float_columns,
            "int_columns": int_columns,
            "title": "Hourly metrics — float vs integer (chronological X)",
            "x_label": "Datetime (hour start)",
            "y_left_label": "Float values (left Y)",
            "y_right_label": "Integer values (right Y)",
            "int_line_style": "dashed"  # Для пунктирных линий в int_columns
        }
    }
    return data_for_api





# ───────────────────────── Plot: floats (left Y), integers (right Y) ─────────────────────────
"""
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

# ───────────────────────── Sanity output ─────────────────────────
print("Index levels (df_indexed):", df_indexed.index.names)
print("Float columns:", float_columns)
print("Integer-like columns:", int_columns)
"""
