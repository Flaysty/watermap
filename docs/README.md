# Оценка качества прогнозирования различных подходов

| series_name               | model              | n_folds | n_eval_points |  mae  | rmse  | smape | mae_h1 | mae_h24 | mae_h96 | loss  |
|---------------------------|--------------------|:------:|:-------------:|:-----:|:-----:|:-----:|:------:|:-------:|:-------:|:-----:|
| Потребление за период, м3 | Linear Regression  |   4    |      384      | 0.11  | 0.16  | 79.61 |  0.02  |  0.04   |  0.23   | 79.61 |
| Потребление за период, м3 | LGBM               |   4    |      384      | 0.03  | 0.05  | 20.11 |  0.02  |  0.02   |  0.02   | 20.11 |
| Потребление за период, м3 | Transformer        |   6    |      576      | 0.06  | 0.08  | 33.49 |  0.02  |  0.02   |  0.09   | 33.49 |

Просмотреть и запустить моделирование можно здесь: https://colab.research.google.com/drive/1uWrN-9JtGUzCNBO7cQZr5lm4gkUj5OLk?usp=sharing
Сам скрипт можно скачать здесь: https://github.com/Flaysty/watermap/blob/main/docs/Vodokanal_EDA_model.ipynb

## Как выглядит результат моделирование
![Forecast comparison](https://github.com/Flaysty/watermap/raw/main/docs/prediction.png)

**Описание графика:** линии показывают фактическое потребление и прогноз модели на горизонте в дней.
  
### Вывод
**LGBM** демонстрирует наилучшее качество прогноза (MAE≈0.03, SMAPE≈20%), заметно опережая **Linear Regression** (SMAPE≈80%) и **Transformer** (SMAPE≈33%).


