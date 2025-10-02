# Система прогнозирования и предупреждения возникновения аварийных ситуаций на водоканале.
# https://карта-водоканала.рф

## Интерфейс предиктивно-рекомендательной системы 

![Forecast comparison](https://github.com/Flaysty/watermap/raw/main/docs/interface.png)
Видны текущие отклонения и прогнозы технологических ситуаций

![Forecast comparison](https://github.com/Flaysty/watermap/raw/main/docs/interface_2.png)
Видны прогнозы отклонений, технологических ситуаций и рекомендации системы

### Описание

Проект предоставляет систему прогнозирования и оповещения о аварийных ситуациях на водоканале, предоставляет подробный отчет для дальнейшей проверки и реагирования техническим специалистом.


### Установка
1. Убедитесь, что у вас OS Linux и установлен Docker и DockerCompose.
2. Склонируйте репозиторий:
   ```bash
   git clone https://github.com/rushan007/WaterEmergencyPredict.git
   ```
3. Перейдите в папку проекта:
   ```bash
   cd WaterEmergencyPredict
   ```

### Использование   
1. Запустите программу:
   ```bash
   docker-compose up
   ```   
2. В браузере перейдите по адресу http://localhost:3081

### Требования   
- Linux
- Docker
- DockerCompose

## Оценка качества прогнозирования различных подходов

| series_name               | model              | n_folds | n_eval_points |  mae  | rmse  | smape | mae_h1 | mae_h24 | mae_h96 | loss  |
|---------------------------|--------------------|:------:|:-------------:|:-----:|:-----:|:-----:|:------:|:-------:|:-------:|:-----:|
| Потребление за период, м3 | Linear Regression  |   4    |      384      | 0.11  | 0.16  | 79.61 |  0.02  |  0.04   |  0.23   | 79.61 |
| Потребление за период, м3 | LGBM               |   4    |      384      | 0.03  | 0.05  | 20.11 |  0.02  |  0.02   |  0.02   | 20.11 |
| Потребление за период, м3 | Transformer        |   6    |      576      | 0.06  | 0.08  | 33.49 |  0.02  |  0.02   |  0.09   | 33.49 |

* Просмотреть и запустить моделирование можно здесь: https://colab.research.google.com/drive/1uWrN-9JtGUzCNBO7cQZr5lm4gkUj5OLk?usp=sharing
* Сам скрипт можно скачать здесь: https://github.com/Flaysty/watermap/blob/main/docs/Vodokanal_EDA_model.ipynb
* **LGBM** демонстрирует наилучшее качество прогноза (MAE≈0.03, SMAPE≈20%), заметно опережая **Linear Regression** (SMAPE≈80%) и **Transformer** (SMAPE≈33%).


### Как выглядит результат моделирования
![Forecast comparison](https://github.com/Flaysty/watermap/raw/main/docs/prediction.png)

**Описание графика:** линии показывают фактическое (сплошная) потребление и прогноз (пунктирная) модели на горизонте в 4х суток.

