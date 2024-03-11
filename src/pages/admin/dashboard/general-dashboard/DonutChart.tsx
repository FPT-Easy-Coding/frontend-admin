import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart } from '@mantine/charts';
import { Text } from '@mantine/core';
interface QuizDataItem {
    username: string;
    count: number;
}
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
const groupDataByUserId = (data: any[]) => {
    const groupedData: { [key: number]: QuizDataItem } = {};

    data.forEach(item => {
        const userId = item.userId;

        if (groupedData[userId]) {
            groupedData[userId].count += 1;
        } else {
            groupedData[userId] = {
                username: item.userName,
                count: 1,
            };
        }
    });

    return Object.values(groupedData);
};

const generatePieChartData = (data: QuizDataItem[]) => {
    return data.map(item => ({
        name: item.username,
        value: item.count,
        color: getRandomColor(),
    }));
};

const QuizDonutChart = () => {
    const [quizData, setQuizData] = useState<QuizDataItem[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/quiz/get-all-quiz')
            .then(response => {
                const groupedData = groupDataByUserId(response.data);
                setQuizData(groupedData);


            })
            .catch(error => {
                console.error('Error fetching quiz data:', error);
            });
    }, []);

    const pieChartData = generatePieChartData(quizData);
    return (
        <>
            <div style={{ display: 'flex', width: '30vw', height: '34vh', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginLeft: '10px' }}>
                <div style={{ flex: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px' }}>
                    <Text fz="lg" mb="sm" ta="center" style={{ fontWeight: 700 }}>
                        The author has the most quizzes
                    </Text>
                </div>
                <div style={{ flex: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <PieChart
                        withTooltip
                        tooltipDataSource="segment"
                        data={pieChartData}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>
        </>
    );
};

export default QuizDonutChart;
