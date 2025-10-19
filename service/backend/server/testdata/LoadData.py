from pathlib import Path
import pandas as pd
import os, sys


def LoadData(file_path=False):
    # пути к файлам
    excel_file_paths = []

    if file_path is not False:
        base_path: Path = Path('uploads/'+file_path).resolve()
        if base_path.exists() and base_path.is_file():
            excel_file_paths = [base_path]

    if not excel_file_paths:
        # Базовая папка, где лежат .xlsx (по умолчанию — текущая рабочая директория)
        base_directory: Path = Path("./testdata/xlsx").resolve()
        # Если нужно искать только в корне без подпапок, замените rglob на glob
        excel_file_paths = sorted(
            p for p in base_directory.rglob("*.xlsx")
            if not p.name.startswith("~$")  # игнор временных файлов Excel
        )

    #print(excel_file_paths); sys.exit()

    # ───────────────────────── Read all Excel sheets ─────────────────────────
    dataframes_list: list[pd.DataFrame] = []             # сюда собираем все DF
    dataframes_index: list[tuple[str, str]] = []         # (file_name, sheet_name) для каждого DF

    for excel_path in excel_file_paths:
        # sheet_name=None вернёт dict: {sheet_name: DataFrame}
        sheets_dict = pd.read_excel(excel_path, sheet_name=None, engine="openpyxl")

        for sheet_name, df in sheets_dict.items():
            df = df.copy()

            # Сохраняем источник в атрибутах датафрейма (удобно при отладке)
            df.attrs["source_file_path"] = str(excel_path)
            df.attrs["source_file_name"] = excel_path.name
            df.attrs["source_sheet_name"] = sheet_name

            dataframes_list.append(df)
            dataframes_index.append((excel_path.name, sheet_name))

    return dataframes_list[0];

'''
# ───────────────────────── Build catalog ─────────────────────────
catalog_records = []
for (file_name, sheet_name), df in zip(dataframes_index, dataframes_list):
    catalog_records.append({
        "file_name": file_name,
        "sheet_name": sheet_name,
        "n_rows": df.shape[0],
        "n_cols": df.shape[1]
    })

dataframe_catalog: pd.DataFrame = pd.DataFrame(catalog_records)

# Удобный словарь: ключ "file.xlsx::Sheet1" -> DataFrame
dataframes_by_source: dict[str, pd.DataFrame] = {
    f"{file_name}::{sheet_name}": df
    for (file_name, sheet_name), df in zip(dataframes_index, dataframes_list)
}
'''

# ───────────────────────── Usage examples ─────────────────────────
'''
print(f"Found {len(excel_file_paths)} .xlsx files.")
print(f"Collected {len(dataframes_list)} DataFrames (all sheets from all files).")

# Посмотреть каталог источников
print(dataframe_catalog)

# Пример доступа к первому датафрейму ( Посуточная ведомость ОДПУ ГВС.xlsx )
if dataframes_list:
    first_df = dataframes_list[0]
    print("First DF source:", first_df.attrs["source_file_name"], "—", first_df.attrs["source_sheet_name"])
    print(first_df.head())
'''
# Пример доступа по имени файла и листа:
# key = "Посуточная ведомость водосчетчика ХВС ИТП.xlsx::Лист1"
# print(dataframes_by_source[key].head())
