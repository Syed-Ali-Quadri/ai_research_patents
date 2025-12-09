"use client"

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { Loader2, TrendingUp, BarChart3, Activity } from 'lucide-react'

interface GraphData {
    x: number[] | string[];
    y: number[];
    description: string;
}

interface SearchResponse {
    generated_text: string;
    graphs: {
        s_curve: GraphData;
        high_curve: GraphData;
        innovation_usage: GraphData;
    };
    summary: string;
    metadata: {
        source_documents: string[];
        filters_used: string[];
        timestamp: string;
    };
}

const Page = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<SearchResponse | null>(null);

    useEffect(() => {
        // Simulate API call with dummy data
        const fetchData = async () => {
            setLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Dummy data
            const dummyData: SearchResponse = {
                generated_text: `Based on the search query "${query}", we've analyzed patent trends in artificial intelligence and machine learning technologies. The data shows significant growth in AI patent filings over the past decade, with particular emphasis on natural language processing, computer vision, and neural network architectures. The S-curve analysis indicates we're currently in the rapid growth phase of AI innovation, with adoption rates accelerating across various industries including healthcare, automotive, and finance.`,
                graphs: {
                    s_curve: {
                        x: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
                        y: [120, 280, 520, 980, 1650, 9000, 9500, 10200, 10800, 12500, 13000],
                        description: "S-Curve showing the adoption and growth trajectory of AI patents over time. The curve demonstrates classic innovation diffusion patterns with exponential growth phase."
                    },
                    high_curve: {
                        x: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
                        y: [450, 680, 920, 1280, 1650, 2100, 2650, 3200, 3850, 4500, 5200],
                        description: "High-value patent curve indicating breakthrough innovations and their market impact. Shows correlation between patent quality and commercial success."
                    },
                    innovation_usage: {
                        x: ['Q1-2022', 'Q2-2022', 'Q3-2022', 'Q4-2022', 'Q1-2023', 'Q2-2023', 'Q3-2023', 'Q4-2023', 'Q1-2024', 'Q2-2024', 'Q3-2024'],
                        y: [3200, 3850, 4100, 4750, 5200, 5900, 6450, 7100, 7800, 8600, 9400],
                        description: "Innovation usage metrics combining patent filings (bars) with actual market adoption rates (line). The gap indicates potential commercialization opportunities."
                    }
                },
                summary: "The analysis reveals a robust innovation ecosystem with strong growth indicators. Key findings include: 1) Exponential growth in patent applications (127% increase over 3 years), 2) High correlation between patent quality and market adoption, 3) Emerging opportunities in specialized AI applications, particularly in edge computing and federated learning.",
                metadata: {
                    source_documents: [
                        "USPTO Patent Database 2024",
                        "WIPO Global Patent Index",
                        "IEEE Innovation Database",
                        "ArXiv Research Papers Collection"
                    ],
                    filters_used: [
                        "Technology: Artificial Intelligence",
                        "Date Range: 2014-2024",
                        "Region: Global",
                        "Status: Granted & Pending"
                    ],
                    timestamp: new Date().toISOString()
                }
            };

            setData(dummyData);
            setLoading(false);
        };

        if (query) {
            fetchData();
        }
    }, [query]);

    // S-Curve Chart Options (Smoothed Line Chart)
    const sCurveOptions = {
        title: {
            text: 'S-Curve Analysis',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data?.graphs.s_curve.x || [],
            boundaryGap: false,
            name: 'Year',
            nameLocation: 'middle',
            nameGap: 30
        },
        yAxis: {
            type: 'value',
            name: 'Patent Count',
            nameLocation: 'middle',
            nameGap: 50
        },
        series: [
            {
                name: 'S-Curve',
                type: 'line',
                smooth: true,
                data: data?.graphs.s_curve.y || [],
                lineStyle: {
                    width: 3,
                    color: '#4F46E5'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(79, 70, 229, 0.3)' },
                            { offset: 1, color: 'rgba(79, 70, 229, 0.05)' }
                        ]
                    }
                },
                emphasis: {
                    focus: 'series'
                }
            }
        ]
    };

    // High Curve Chart Options (Graph on Cartesian)
    const highCurveOptions = {
        title: {
            text: 'High-Value Patent Trajectory',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data?.graphs.high_curve.x || [],
            name: 'Year',
            nameLocation: 'middle',
            nameGap: 30
        },
        yAxis: {
            type: 'value',
            name: 'High-Value Patents',
            nameLocation: 'middle',
            nameGap: 50
        },
        series: [
            {
                name: 'High-Value Patents',
                type: 'line',
                data: data?.graphs.high_curve.y || [],
                lineStyle: {
                    width: 3,
                    color: '#10B981'
                },
                itemStyle: {
                    color: '#10B981'
                },
                symbol: 'circle',
                symbolSize: 8,
                emphasis: {
                    focus: 'series',
                    scale: true
                }
            }
        ]
    };

    // Innovation Usage Chart Options (Mixed Line and Bar)
    const innovationUsageOptions = {
        title: {
            text: 'Innovation Usage & Adoption',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data: ['Patent Filings', 'Market Adoption'],
            bottom: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data?.graphs.innovation_usage.x || [],
            axisPointer: {
                type: 'shadow'
            },
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: [
            {
                type: 'value',
                name: 'Patent Filings',
                nameLocation: 'middle',
                nameGap: 50,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: 'Adoption Rate',
                nameLocation: 'middle',
                nameGap: 50,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: 'Patent Filings',
                type: 'bar',
                data: data?.graphs.innovation_usage.y || [],
                itemStyle: {
                    color: '#8B5CF6',
                    borderRadius: [4, 4, 0, 0]
                },
                emphasis: {
                    focus: 'series'
                }
            },
            {
                name: 'Market Adoption',
                type: 'line',
                yAxisIndex: 1,
                data: data?.graphs.innovation_usage.y.map(v => v * 0.85) || [],
                lineStyle: {
                    width: 3,
                    color: '#F59E0B'
                },
                itemStyle: {
                    color: '#F59E0B'
                },
                smooth: true,
                emphasis: {
                    focus: 'series'
                }
            }
        ]
    };

    if (!query) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-500 text-lg">No search query provided</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Analyzing patent data for "{query}"...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
                    <p className="mt-2 text-gray-600">Query: <span className="font-semibold text-indigo-600">"{query}"</span></p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Generated Text Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center mb-4">
                        <Activity className="w-6 h-6 text-indigo-600 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">AI-Generated Analysis</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{data?.generated_text}</p>
                </div>

                {/* Summary Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{data?.summary}</p>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 gap-8 mb-8">
                    {/* S-Curve Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <TrendingUp className="w-5 h-5 text-indigo-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">S-Curve Analysis</h3>
                        </div>
                        <ReactECharts option={sCurveOptions} style={{ height: '400px' }} />
                        <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                            {data?.graphs.s_curve.description}
                        </p>
                    </div>

                    {/* High Curve Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">High-Value Patent Trajectory</h3>
                        </div>
                        <ReactECharts option={highCurveOptions} style={{ height: '400px' }} />
                        <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                            {data?.graphs.high_curve.description}
                        </p>
                    </div>

                    {/* Innovation Usage Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <Activity className="w-5 h-5 text-purple-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">Innovation Usage & Adoption</h3>
                        </div>
                        <ReactECharts option={innovationUsageOptions} style={{ height: '400px' }} />
                        <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                            {data?.graphs.innovation_usage.description}
                        </p>
                    </div>
                </div>

                {/* Metadata Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Metadata</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Source Documents</h3>
                            <ul className="space-y-2">
                                {data?.metadata.source_documents.map((doc, index) => (
                                    <li key={index} className="text-gray-700 flex items-start">
                                        <span className="text-indigo-600 mr-2">•</span>
                                        {doc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Filters Applied</h3>
                            <div className="flex flex-wrap gap-2">
                                {data?.metadata.filters_used.map((filter, index) => (
                                    <span 
                                        key={index} 
                                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                                    >
                                        {filter}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                Generated: {new Date(data?.metadata.timestamp || '').toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;