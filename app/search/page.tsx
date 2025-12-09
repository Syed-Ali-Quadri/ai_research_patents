"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, Suspense } from 'react'
import ReactECharts from 'echarts-for-react'
import { Loader2, TrendingUp, BarChart3, Activity, GitMerge, Search } from 'lucide-react'

interface GraphData {
    x: number[] | string[];
    y: number[] | number[][];
    description: string;
}

interface TechnologyConvergenceData {
    technologies: string[];
    convergence_scores: number[];
    description: string;
}

interface SearchResponse {
    generated_text: string;
    graphs: {
        s_curve: GraphData;
        hype_curve: {
            x: number[] | string[];
            series: {
                name: string;
                data: number[];
            }[];
            description: string;
        };
        innovation_usage: GraphData;
        technology_convergence: TechnologyConvergenceData;
    };
    summary: string;
    metadata: {
        source_documents: string[];
        filters_used: string[];
        timestamp: string;
    };
}

const SearchContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<SearchResponse | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

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
                    hype_curve: {
                        x: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
                        series: [
                            {
                                name: 'Innovation Trigger',
                                data: [800, 1200, 1800, 2400, 3000, 3400, 3600, 3700, 3750, 3800, 3850]
                            },
                            {
                                name: 'Peak of Inflated Expectations',
                                data: [200, 450, 850, 1500, 2200, 2800, 3100, 3200, 3250, 3300, 3350]
                            },
                            {
                                name: 'Trough of Disillusionment',
                                data: [100, 250, 500, 900, 1400, 1900, 2200, 2400, 2500, 2600, 2700]
                            },
                            {
                                name: 'Slope of Enlightenment',
                                data: [50, 150, 350, 700, 1200, 1800, 2300, 2700, 3000, 3300, 3600]
                            },
                            {
                                name: 'Plateau of Productivity',
                                data: [20, 80, 200, 450, 850, 1400, 2000, 2700, 3500, 4500, 5800]
                            }
                        ],
                        description: "Hype Cycle showing different stages of technology maturity and adoption. The stacked areas represent the volume of patents in each maturity phase, indicating the overall technology lifecycle progression."
                    },
                    innovation_usage: {
                        x: ['Q1-2022', 'Q2-2022', 'Q3-2022', 'Q4-2022', 'Q1-2023', 'Q2-2023', 'Q3-2023', 'Q4-2023', 'Q1-2024', 'Q2-2024', 'Q3-2024'],
                        y: [3200, 3850, 4100, 4750, 5200, 5900, 6450, 7100, 7800, 8600, 9400],
                        description: "Innovation usage metrics combining patent filings (bars) with actual market adoption rates (line). The gap indicates potential commercialization opportunities."
                    },
                    technology_convergence: {
                        technologies: [
                            'AI + IoT',
                            'Blockchain + Healthcare',
                            'Quantum + Cryptography',
                            '5G + Edge Computing',
                            'AR/VR + Education',
                            'Robotics + Agriculture',
                            'Biotech + Nanotech',
                            'Clean Energy + AI'
                        ],
                        convergence_scores: [92, 78, 85, 88, 72, 65, 80, 90],
                        description: "Technology convergence detection showing the intersection and synergy between different technology domains. Higher scores indicate stronger patent activity at the convergence points, suggesting emerging innovation opportunities."
                    }
                },
                summary: "The analysis reveals a robust innovation ecosystem with strong growth indicators. Key findings include: 1) Exponential growth in patent applications (127% increase over 3 years), 2) High correlation between patent quality and market adoption, 3) Emerging opportunities in specialized AI applications, particularly in edge computing and federated learning. Technology convergence analysis shows strong synergies between AI+IoT and Clean Energy+AI domains.",
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
                fontSize: 16,
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
            left: '8%',
            right: '4%',
            bottom: '8%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data?.graphs.s_curve.x || [],
            boundaryGap: false,
            name: 'Year',
            nameLocation: 'middle',
            nameGap: 25
        },
        yAxis: {
            type: 'value',
            name: 'Patent Count',
            nameLocation: 'middle',
            nameGap: 40
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

    // Hype Curve Chart Options (Multiple Colored Lines)
    const hypeCurveOptions = {
        title: {
            text: 'Technology Hype Cycle',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: data?.graphs.hype_curve.series.map(s => s.name) || [],
            bottom: 5,
            type: 'scroll',
            textStyle: {
                fontSize: 10
            }
        },
        grid: {
            left: '8%',
            right: '4%',
            bottom: '20%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data?.graphs.hype_curve.x || [],
            boundaryGap: false,
            name: 'Year',
            nameLocation: 'middle',
            nameGap: 25
        },
        yAxis: {
            type: 'value',
            name: 'Patent Volume',
            nameLocation: 'middle',
            nameGap: 40
        },
        series: data?.graphs.hype_curve.series.map((series, index) => ({
            name: series.name,
            type: 'line',
            smooth: true,
            data: series.data,
            lineStyle: {
                width: 2.5,
                color: [
                    '#4F46E5',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6'
                ][index % 5]
            },
            itemStyle: {
                color: [
                    '#4F46E5',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6'
                ][index % 5]
            },
            symbol: 'circle',
            symbolSize: 5,
            emphasis: {
                focus: 'series',
                scale: true
            }
        })) || []
    };

    // Innovation Usage Chart Options (Mixed Line and Bar)
    const innovationUsageOptions = {
        title: {
            text: 'Innovation Usage & Adoption',
            left: 'center',
            textStyle: {
                fontSize: 16,
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
            bottom: 5,
            textStyle: {
                fontSize: 11
            }
        },
        grid: {
            left: '8%',
            right: '8%',
            bottom: '20%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data?.graphs.innovation_usage.x || [],
            axisPointer: {
                type: 'shadow'
            },
            axisLabel: {
                rotate: 45,
                fontSize: 10
            }
        },
        yAxis: [
            {
                type: 'value',
                name: 'Patent Filings',
                nameLocation: 'middle',
                nameGap: 40,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: 'Adoption Rate',
                nameLocation: 'middle',
                nameGap: 40,
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
                data: (Array.isArray(data?.graphs.innovation_usage.y) && typeof data.graphs.innovation_usage.y[0] === 'number' 
                    ? (data.graphs.innovation_usage.y as number[]).map(v => v * 0.85) 
                    : []) || [],
                lineStyle: {
                    width: 2.5,
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

    // Technology Convergence Chart Options (Set Style of Single Bar)
    const technologyConvergenceOptions = {
        title: {
            text: 'Technology Convergence Detection',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: (params: any) => {
                const param = params[0];
                return `${param.name}<br/>Convergence Score: ${param.value}%`;
            }
        },
        grid: {
            left: '3%',
            right: '8%',
            bottom: '5%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            max: 100,
            name: 'Convergence Score (%)',
            nameLocation: 'middle',
            nameGap: 25
        },
        yAxis: {
            type: 'category',
            data: data?.graphs.technology_convergence.technologies || [],
            axisLabel: {
                fontSize: 11,
                interval: 0
            }
        },
        series: [
            {
                name: 'Convergence Score',
                type: 'bar',
                data: data?.graphs.technology_convergence.convergence_scores.map((score, index) => ({
                    value: score,
                    itemStyle: {
                        color: score >= 85 ? '#10B981' : score >= 70 ? '#F59E0B' : '#EF4444',
                        borderRadius: [0, 4, 4, 0]
                    }
                })) || [],
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}%',
                    fontSize: 11
                },
                emphasis: {
                    focus: 'series',
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,0,0,0.3)'
                    }
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
                    <p className="text-gray-600 text-lg">Analyzing patent data for &quot;{query}&quot;...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Search Bar */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">SmartTech Forecast Engine</h1>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="w-full">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>

                            <input
                                type="text"
                                value={searchQuery || query || ''}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search patents, technologies, or innovations..."
                                className="w-full pl-12 pr-32 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-800 placeholder-gray-400"
                            />

                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    <p className="mt-3 text-sm text-gray-600">
                        Current query: <span className="font-semibold text-indigo-600">&quot;{query}&quot;</span>
                    </p>
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

                {/* Charts Grid - 2 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* S-Curve Chart */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex items-center mb-3">
                            <TrendingUp className="w-5 h-5 text-indigo-600 mr-2" />
                            <h3 className="text-base font-semibold text-gray-900">S-Curve Analysis</h3>
                        </div>
                        <ReactECharts option={sCurveOptions} style={{ height: '350px' }} />
                        <p className="mt-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {data?.graphs.s_curve.description}
                        </p>
                    </div>

                    {/* Hype Curve Chart */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex items-center mb-3">
                            <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                            <h3 className="text-base font-semibold text-gray-900">Technology Hype Cycle</h3>
                        </div>
                        <ReactECharts option={hypeCurveOptions} style={{ height: '350px' }} />
                        <p className="mt-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {data?.graphs.hype_curve.description}
                        </p>
                    </div>

                    {/* Innovation Usage Chart */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex items-center mb-3">
                            <Activity className="w-5 h-5 text-purple-600 mr-2" />
                            <h3 className="text-base font-semibold text-gray-900">Innovation Usage & Adoption</h3>
                        </div>
                        <ReactECharts option={innovationUsageOptions} style={{ height: '350px' }} />
                        <p className="mt-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {data?.graphs.innovation_usage.description}
                        </p>
                    </div>

                    {/* Technology Convergence Chart */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex items-center mb-3">
                            <GitMerge className="w-5 h-5 text-cyan-600 mr-2" />
                            <h3 className="text-base font-semibold text-gray-900">Technology Convergence Detection</h3>
                        </div>
                        <ReactECharts option={technologyConvergenceOptions} style={{ height: '350px' }} />
                        <p className="mt-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {data?.graphs.technology_convergence.description}
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span className="text-gray-600">High (≥85%)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                <span className="text-gray-600">Medium (70-84%)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-red-500 rounded"></div>
                                <span className="text-gray-600">Low (&lt;70%)</span>
                            </div>
                        </div>
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

const Page = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Loading search...</p>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
};

export default Page;