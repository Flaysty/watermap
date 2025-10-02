# Система прогнозирования и предупреждения возникновения аварийных ситуаций на водоканале.
# https://карта-водоканала.рф

## Интерфейс предиктивно-рекомендательной системы 

![Forecast comparison](https://github.com/Flaysty/watermap/raw/main/docs/interface.png)
Видны текущие отклонения и прогнозы технологических ситуаций

![Forecast comparison](https://github.com/Flaysty/watermap/raw/main/docs/interface_2.png)
Видны прогнозы отклонений, технологических ситуаций и рекомендации системы

## Описание

Проект предоставляет систему прогнозирования и оповещения о чрезвычайных ситуациях на водоканале, предоставляет подробный отчет для дальнейшей проверки и реагирования техническим специалистом.


## Установка
1. Убедитесь, что у вас OS Linux и установлен Docker и DockerCompose.
2. Склонируйте репозиторий:
   ```bash
   git clone https://github.com/rushan007/WaterEmergencyPredict.git
   ```
3. Перейдите в папку проекта:
   ```bash
   cd WaterEmergencyPredict
   ```

## Использование   
1. Запустите программу:
   ```bash
   docker-compose up
   ```   
2. В браузере перейдите по адресу http://localhost:3081

## Требования   
- Linux
- Docker
- DockerCompose
