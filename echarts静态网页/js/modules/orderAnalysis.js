import { loadData } from '../utils/dataLoader.js';

const chartInstances = {};

function createChartOption(chartType, data, theme) {
    const isDarkTheme = theme === 'dark';
    const textColor = isDarkTheme ? '#ccc' : '#333';
    const axisLineColor = isDarkTheme ? '#555' : '#ccc';
    const splitLineColor = isDarkTheme ? '#333' : '#eee';
    const accentColor = isDarkTheme ? '#ff9f0a' : '#f39c12'; // Orange accent for orders

    switch (chartType) {
        case 'dailyOrders':
            return {
                tooltip: { trigger: 'axis' },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.dates,
                    axisLine: { lineStyle: { color: axisLineColor } },
                    axisLabel: { color: textColor }
                },
                yAxis: {
                    type: 'value',
                    name: '订单量',
                    axisLine: { lineStyle: { color: axisLineColor } },
                    axisLabel: { color: textColor },
                    splitLine: { lineStyle: { color: splitLineColor } }
                },
                series: [{
                    name: '单日订单量',
                    type: 'line',
                    smooth: true,
                    data: data.counts,
                    itemStyle: { color: accentColor },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: isDarkTheme ? 'rgba(255, 159, 10, 0.5)' : 'rgba(243, 156, 18, 0.5)'
                        }, {
                            offset: 1,
                            color: isDarkTheme ? 'rgba(255, 159, 10, 0.1)' : 'rgba(243, 156, 18, 0.1)'
                        }])
                    }
                }]
            };
        case 'orderStatus':
            return {
                tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
                legend: { data: data.map(item => item.name), textStyle: { color: textColor }, bottom: 10, type: 'scroll' },
                series: [{
                    name: '订单状态',
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    data: data,
                    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } },
                    label: { color: textColor }
                }]
            };
        case 'regionalOrders': //南丁格尔玫瑰图
            return {
                tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
                legend: { data: data.map(item => item.name), textStyle: { color: textColor }, bottom: 10, type: 'scroll' },
                series: [{
                    name: '各地区订单量',
                    type: 'pie',
                    radius: [30, '70%'], // Inner and outer radius for Nightingale
                    center: ['50%', '50%'],
                    roseType: 'area', // 'radius' or 'area'
                    itemStyle: { borderRadius: 5 },
                    data: data,
                    label: { color: textColor }
                }]
            };
        case 'deliveryMethods':
            return {
                tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
                legend: { data: data.map(item => item.name), textStyle: { color: textColor }, bottom: 10, type: 'scroll' },
                series: [{
                    name: '配送方式',
                    type: 'pie',
                    radius: ['40%', '70%'], // Donut chart
                    avoidLabelOverlap: false,
                    itemStyle: { borderRadius: 5, borderColor: isDarkTheme ? '#2c2c2e' : '#fff', borderWidth: 2 },
                    label: { show: true, formatter: '{b}\n{d}%', color: textColor },
                    emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold' } },
                    data: data
                }]
            };
        default:
            return {};
    }
}

async function initChart(chartId, dataPath, chartType, theme) {
    const chartDom = document.getElementById(chartId);
    if (!chartDom) {
        console.error(`Chart container with id "${chartId}" not found.`);
        return;
    }
    if (chartInstances[chartId]) {
        chartInstances[chartId].dispose();
        chartInstances[chartId] = null;
    }
    chartDom.innerHTML = '<div class="loading-placeholder">加载中...</div>';

    try {
        const data = await loadData(dataPath);
        const chart = echarts.init(chartDom, theme === 'dark' ? 'dark' : null);
        const option = createChartOption(chartType, data, theme);
        chart.setOption(option);
        chartInstances[chartId] = chart;
    } catch (error) {
        console.error(`Failed to initialize chart ${chartId}:`, error);
        chartDom.innerHTML = `<div class="error-placeholder">图表加载失败: ${error.message}</div>`;
    }
}

export function initOrderAnalysisCharts(theme) {
    initChart('daily-orders-chart', 'order/dailyOrders.json', 'dailyOrders', theme);
    initChart('order-status-chart', 'order/orderStatus.json', 'orderStatus', theme);
    initChart('regional-orders-chart', 'order/regionalOrders.json', 'regionalOrders', theme);
    initChart('delivery-methods-chart', 'order/deliveryMethods.json', 'deliveryMethods', theme);
}

export function resizeOrderAnalysisCharts() {
    for (const chartId in chartInstances) {
        if (chartInstances[chartId]) {
            chartInstances[chartId].resize();
        }
    }
}