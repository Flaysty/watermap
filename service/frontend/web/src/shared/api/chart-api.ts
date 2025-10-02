// API функции для получения данных графиков
export interface ChartDataResponse {
  status: string
  data: string // JSON строка с данными
}

export interface ChartData {
  datetime_start: string[]
  float_columns: {
    'Подача, м3': number[]
    'Обратка, м3': number[]
    'Потребление за период, м3': number[]
  }
  int_columns: {
    'Т1 гвс, оС': number[]
    'Т2 гвс, оС': number[]
  }
  metadata: {
    float_columns: string[]
    int_columns: string[]
    title: string
    x_label: string
    y_left_label: string
    y_right_label: string
    int_line_style: string
  }
}

export interface PredictionChartData {
  columns: Array<{
    name: string
    type: string
  }>
  historical_data: Array<{
    datetime: string
    values: {
      'Подача, м3': number
      'Обратка, м3': number
      'Потребление за период, м3': number
      'Т1 гвс, оС': number
      'Т2 гвс, оС': number
    }
  }>
  forecast_data: Array<{
    datetime: string
    values: {
      'Подача, м3': number
      'Обратка, м3': number
      'Потребление за период, м3': number
      'Т1 гвс, оС': number
      'Т2 гвс, оС': number
    }
  }>
}

export interface ProcessedChartData {
  datetime: string[]
  podacha: number[]
  obratka: number[]
  potreblenie: number[]
  temperatura1: number[]
  temperatura2: number[]
  metadata: ChartData['metadata']
}

export interface ProcessedPredictionData {
  historical: Array<{
    datetime: string
    podacha: number
    obratka: number
    potreblenie: number
    temperatura1: number
    temperatura2: number
  }>
  forecast: Array<{
    datetime: string
    podacha: number
    obratka: number
    potreblenie: number
    temperatura1: number
    temperatura2: number
  }>
}

export interface IntradayAnalyticsData {
  datetime: string
  values: {
    'Подача, м3': number
    'Обратка, м3': number
    'Потребление за период, м3': number
    'Т1 гвс, оС': number
    'Т2 гвс, оС': number
  }
}

export interface IntradayAnalyticsResponse {
  status: string
  data: string
}

export interface ProcessedIntradayAnalyticsData {
  datetime: string[]
  podacha: number[]
  obratka: number[]
  potreblenie: number[]
  temperatura1: number[]
  temperatura2: number[]
}

// Функция для получения данных графиков
export const fetchChartData = async (): Promise<ProcessedChartData> => {
  const response = await fetch('/api/fetch_chart_data?action=Visualization')

  if (!response.ok) {
    throw new Error('Ошибка загрузки данных графиков')
  }

  const result: ChartDataResponse = await response.json()

  if (result.status !== 'ok') {
    throw new Error('Неверный статус ответа')
  }

  const data: ChartData = JSON.parse(result.data)

  // Преобразуем данные в удобный формат
  return {
    datetime: data.datetime_start,
    podacha: data.float_columns['Подача, м3'],
    obratka: data.float_columns['Обратка, м3'],
    potreblenie: data.float_columns['Потребление за период, м3'],
    temperatura1: data.int_columns['Т1 гвс, оС'],
    temperatura2: data.int_columns['Т2 гвс, оС'],
    metadata: data.metadata,
  }
}

// Функция для получения данных прогнозирования
export const fetchPredictionData =
  async (): Promise<ProcessedPredictionData> => {
    const response = await fetch('/api/fetch_chart_data?action=LR_prediction')

    if (!response.ok) {
      throw new Error('Ошибка загрузки данных прогнозирования')
    }

    const result: ChartDataResponse = await response.json()

    if (result.status !== 'ok') {
      throw new Error('Неверный статус ответа')
    }

    const data: PredictionChartData = JSON.parse(result.data)

    // Преобразуем исторические данные
    const historical = data.historical_data.map(item => ({
      datetime: item.datetime,
      podacha: item.values['Подача, м3'],
      obratka: item.values['Обратка, м3'],
      potreblenie: item.values['Потребление за период, м3'],
      temperatura1: item.values['Т1 гвс, оС'],
      temperatura2: item.values['Т2 гвс, оС'],
    }))

    // Преобразуем прогнозные данные
    const forecast = data.forecast_data.map(item => ({
      datetime: item.datetime,
      podacha: item.values['Подача, м3'],
      obratka: item.values['Обратка, м3'],
      potreblenie: item.values['Потребление за период, м3'],
      temperatura1: item.values['Т1 гвс, оС'],
      temperatura2: item.values['Т2 гвс, оС'],
    }))

    return {
      historical,
      forecast,
    }
  }

// Функция для получения данных внутридневной аналитики
export const fetchIntradayAnalyticsData =
  async (): Promise<ProcessedIntradayAnalyticsData> => {
    const response = await fetch(
      '/api/fetch_chart_data?action=IntradayAnalytics',
    )

    if (!response.ok) {
      throw new Error('Ошибка загрузки данных внутридневной аналитики')
    }

    const result: IntradayAnalyticsResponse = await response.json()

    if (result.status !== 'ok') {
      throw new Error('Неверный статус ответа')
    }

    const data = JSON.parse(result.data)

    const processedData: ProcessedIntradayAnalyticsData = {
      datetime: [],
      podacha: [],
      obratka: [],
      potreblenie: [],
      temperatura1: [],
      temperatura2: [],
    }

    if (data.historical_data && Array.isArray(data.historical_data)) {
      data.historical_data.forEach((item: IntradayAnalyticsData) => {
        processedData.datetime.push(item.datetime)
        processedData.podacha.push(item.values['Подача, м3'])
        processedData.obratka.push(item.values['Обратка, м3'])
        processedData.potreblenie.push(item.values['Потребление за период, м3'])
        processedData.temperatura1.push(item.values['Т1 гвс, оС'])
        processedData.temperatura2.push(item.values['Т2 гвс, оС'])
      })
    }

    return processedData
  }
