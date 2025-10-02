# ───────────────────────── Fast SARIMA (first float) + tqdm, no grid search ─────────────────────────
import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
#import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.stattools import adfuller
from sklearn.metrics import mean_absolute_error, mean_squared_error
from tqdm.auto import tqdm



# ───────────────────────── Helpers ─────────────────────────
def detect_date_and_hour_columns(df: pd.DataFrame) -> tuple[str, str]:
    date_col = next((c for c in df.columns if "Дата" in str(c)), df.columns[0])
    hour_col = next((c for c in df.columns if "сут" in str(c) or "Время" in str(c)), df.columns[1])
    return date_col, hour_col

def get_first_float_column(df: pd.DataFrame, exclude: set[str]) -> str:
    """Return the first non-integer-like numeric column (fallback to first numeric)."""
    for col in df.columns:
        if col in exclude:
            continue
        series = pd.to_numeric(df[col], errors="coerce")
        if series.notna().any():
            non_na = series.dropna()
            if not np.isclose(non_na % 1, 0).all():  # not integer-like → treat as float metric
                return col
    # fallback: first numeric at all
    for col in df.columns:
        if col in exclude:
            continue
        if pd.to_numeric(df[col], errors="coerce").notna().any():
            return col
    raise ValueError("No numeric columns found for SARIMA target.")

def build_hourly_series(df_raw: pd.DataFrame, date_col: str, hour_col: str, target_col: str) -> pd.Series:
    df = df_raw.copy()
    df["date"] = pd.to_datetime(df[date_col], dayfirst=True, errors="coerce")
    df["hour_start"] = (
        df[hour_col].astype(str).str.extract(r"^\s*(\d+)").iloc[:, 0].astype(float).astype(int)
    )
    df["datetime_start"] = df["date"] + pd.to_timedelta(df["hour_start"], unit="h")
    df[target_col] = pd.to_numeric(df[target_col], errors="coerce")
    ts = (
        df.sort_values("datetime_start")
          .set_index("datetime_start")[target_col]
          .asfreq("H")
          .interpolate(method="time").bfill().ffill()
    )
    return ts

def infer_d_adf(ts: pd.Series, max_d: int = 2, alpha: float = 0.05) -> int:
    """Infer non-seasonal differencing d via ADF; fallback to 1."""
    for d in range(max_d + 1):
        series = ts.diff(d).dropna() if d > 0 else ts
        try:
            pval = adfuller(series, autolag="AIC")[1]
        except Exception:
            continue
        if pval < alpha:
            return d
    return 1

def infer_D_adf(ts: pd.Series, season: int = 24, max_D: int = 1, alpha: float = 0.05) -> int:
    """Infer seasonal differencing D via ADF on seasonally differenced series; fallback to 1."""
    for D in range(max_D + 1):
        series = ts.diff(season * D).dropna() if D > 0 else ts
        try:
            pval = adfuller(series, autolag="AIC")[1]
        except Exception:
            continue
        if pval < alpha:
            return D
    return 1

def compute_metrics(y_true: pd.Series, y_pred: pd.Series) -> dict:
    mae = mean_absolute_error(y_true, y_pred)
    # ⚠️ No 'squared' kw: compute RMSE manually
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mape = (np.abs((y_true - y_pred) / np.clip(np.abs(y_true), 1e-9, None))).mean() * 100
    return {"MAE": mae, "RMSE": rmse, "MAPE_%": mape}




def SARIMA(dataframes_list):
    # ───────────────────────── Data prep ─────────────────────────
    df_source: pd.DataFrame = dataframes_list.copy()
    date_col, hour_col = detect_date_and_hour_columns(df_source)
    target_col: str = get_first_float_column(df_source, exclude={date_col, hour_col})
    ts: pd.Series = build_hourly_series(df_source, date_col, hour_col, target_col)

    '''
    print(f"Detected date column: {date_col}")
    print(f"Detected hour column: {hour_col}")
    print(f"Target column (first float): {target_col}")
    print(f"Series length: {len(ts)}, span: {ts.index.min()} → {ts.index.max()}")
    '''

    # ───────────────────────── Split ─────────────────────────
    test_hours: int = 24 * 7
    split_idx: int = max(len(ts) - test_hours, int(len(ts) * 0.7))
    y_train, y_test = ts.iloc[:split_idx], ts.iloc[split_idx:]

    # ───────────────────────── Fast SARIMA with tqdm over steps ─────────────────────────
    total_steps: int = 6  # d, D, fit(train), forecast(test), fit(full), forecast(future)
    #with tqdm(total=total_steps, desc="Fast SARIMA pipeline") as pbar:
    seasonal_period: int = 24
    d_auto: int = infer_d_adf(y_train, max_d=2, alpha=0.05); # pbar.update(1)
    D_auto: int = infer_D_adf(y_train, season=seasonal_period, max_D=1, alpha=0.05); # pbar.update(1)

    order = (1, d_auto, 1)
    seasonal_order = (1, D_auto, 1, seasonal_period)
    #print(f"Using order={order}, seasonal_order={seasonal_order}")

    model = SARIMAX(
        y_train,
        order=order,
        seasonal_order=seasonal_order,
        enforce_stationarity=False,
        enforce_invertibility=False,
    )
    result = model.fit(disp=False, method="lbfgs", maxiter=300); #pbar.update(1)

    y_pred_test = result.get_forecast(steps=len(y_test)).predicted_mean
    y_pred_test.index = y_test.index; # pbar.update(1)

    model_full = SARIMAX(
        ts,
        order=order,
        seasonal_order=seasonal_order,
        enforce_stationarity=False,
        enforce_invertibility=False,
    ).fit(disp=False, method="lbfgs", maxiter=300); #pbar.update(1)

    future_horizon_hours: int = 48
    y_future = model_full.get_forecast(steps=future_horizon_hours).predicted_mean; # pbar.update(1)

    # ───────────────────────── Metrics & Plot ─────────────────────────
    metrics = compute_metrics(y_test, y_pred_test)

    # Convert series to lists for JSON serialization
        # Prepare JSON output
    json_output = {
        "series": {
            "train": {
                "timestamps": y_train.index.strftime("%Y-%m-%d %H:%M:%S").tolist(),
                "values": y_train.tolist()
            },
            "test": {
                "timestamps": y_test.index.strftime("%Y-%m-%d %H:%M:%S").tolist(),
                "values": y_test.tolist()
            },
            "test_forecast": {
                "timestamps": y_pred_test.index.strftime("%Y-%m-%d %H:%M:%S").tolist(),
                "values": y_pred_test.tolist()
            },
            "future_forecast": {
                "timestamps": y_future.index.strftime("%Y-%m-%d %H:%M:%S").tolist(),
                "values": y_future.tolist()
            }
        },
        "metrics": metrics,
        "metadata": {
            "target_column": target_col,
            "series_length": len(ts),
            "start_time": ts.index.min().strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": ts.index.max().strftime("%Y-%m-%d %H:%M:%S"),
            "order": list(order),
            "seasonal_order": list(seasonal_order)
        }
    }

    return result


'''
print("Test metrics:", {k: round(v, 6) for k, v in metrics.items()})

plt.figure(figsize=(14, 6))
plt.plot(y_train.index, y_train.values, label="Train", linewidth=1.6)
plt.plot(y_test.index, y_test.values, label="Test (actual)", linewidth=1.6)
plt.plot(y_pred_test.index, y_pred_test.values, label="Test (forecast)", linestyle="--", linewidth=1.8)
plt.plot(y_future.index, y_future.values, label="Future 48h forecast", linestyle=":", linewidth=2.0)
plt.title(f"Fast SARIMA on '{target_col}' (no grid search)")
plt.xlabel("Datetime")
plt.ylabel(target_col)
plt.grid(True, alpha=0.3)
plt.legend()
plt.tight_layout()
plt.show()
'''
