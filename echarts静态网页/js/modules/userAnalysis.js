import { loadData } from '../utils/dataLoader.js';

const chartInstances = {};

function createChartOption(chartType, data, theme) {
    const isDarkTheme = theme === 'dark';
    const textColor = isDarkTheme ? '#ccc' : '#333';
    const axisLineColor = isDarkTheme ? '#555' : '#ccc';

    switch (chartType) {
        case 'userCount':
            document.getElementById('display-user-count').textContent = data.currentUserCount.toLocaleString();
            document.getElementById('display-user-growth-rate').textContent = `${data.growthRate}%`;
            return {
                tooltip: { trigger: 'axis' },
                legend: { data: ['本期用户数', '同期用户数'], textStyle: { color: textColor } },
                grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: data.trend.map(item => item.month),
                    axisLine: { lineStyle: { color: axisLineColor } },
                    axisLabel: { color: textColor }
                },
                yAxis: {
                    type: 'value',
                    name: '用户数',
                    axisLine: { lineStyle: { color: axisLineColor } },
                    axisLabel: { color: textColor },
                    splitLine: { lineStyle: { color: isDarkTheme ? '#333' : '#eee' } }
                },
                series: [
                    { name: '本期用户数', type: 'bar', data: data.trend.map(item => item.count), itemStyle: { color: isDarkTheme ? '#0a84ff' : '#007aff' } },
                    { name: '同期用户数', type: 'line', smooth: true, data: data.trend.map(item => item.lastYearCount), itemStyle: { color: isDarkTheme ? '#30d158' : '#2ecc71' } }
                ]
            };
        case 'youngConsumerDemand':
            return {
                tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c}% ({d}%)' },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: data.map(item => item.name),
                    textStyle: { color: textColor }
                },
                series: [{
                    name: '需求分布',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: { borderRadius: 5, borderColor: isDarkTheme ? '#2c2c2e' : '#fff', borderWidth: 2 },
                    label: { show: true, formatter: '{b}\n{d}%', color: textColor },
                    emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold' } },
                    data: data
                }]
            };
        // Add cases for userStatus and userCategory
        case 'userStatus':
             return {
                tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
                legend: { data: data.map(item => item.name), bottom: 10, textStyle: { color: textColor } },
                series: [{
                    name: '用户状态',
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    data: data,
                    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
                    label: { color: textColor }
                }]
            };
        case 'userCategory':
            return {
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                legend: { data: ['用户数'], textStyle: { color: textColor }, bottom: 10 },
                grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: data.map(item => item.name),
                    axisLabel: { interval: 0, rotate: 30, color: textColor },
                    axisLine: { lineStyle: { color: axisLineColor } }
                },
                yAxis: {
                    type: 'value',
                    name: '数量',
                    axisLabel: { color: textColor },
                    axisLine: { lineStyle: { color: axisLineColor } },
                    splitLine: { lineStyle: { color: isDarkTheme ? '#333' : '#eee' } }
                },
                series: [{
                    name: '用户数',
                    type: 'bar',
                    data: data.map(item => item.value),
                    itemStyle: { color: isDarkTheme ? '#0a84ff' : '#007aff' }
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
    }

    // 2. Now set the loading placeholder
    chartDom.innerHTML = '<div class="loading-placeholder">加载中...</div>'; // Loading state

    try {
        const data = await loadData(dataPath);
        // The dispose call was moved up, so no need to check chartInstances[chartId] again here for disposal
        const chart = echarts.init(chartDom, theme === 'dark' ? 'dark' : null); // Use ECharts dark theme if available
        const option = createChartOption(chartType, data, theme);
        chart.setOption(option);
        chartInstances[chartId] = chart;
    } catch (error) {
        console.error(`Failed to initialize chart ${chartId}:`, error);
        chartDom.innerHTML = `<div class="error-placeholder">图表加载失败: ${error.message}</div>`;
    }
}

export function initUserAnalysisCharts(theme) {
    initChart('user-count-chart', 'user/userCount.json', 'userCount', theme);
    initChart('young-consumer-demand-chart', 'user/youngConsumerDemand.json', 'youngConsumerDemand', theme);
    // You'll need to create these JSON files
    initChart('user-status-chart', 'user/userStatus.json', 'userStatus', theme);
    initChart('user-category-chart', 'user/userCategory.json', 'userCategory', theme);
}

export function resizeUserAnalysisCharts() {
    for (const chartId in chartInstances) {
        if (chartInstances[chartId]) {
            chartInstances[chartId].resize();
        }
    }
}