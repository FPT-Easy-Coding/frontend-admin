import { useEffect, useState } from 'react';
import { LineChart } from '@mantine/charts';
import axios, { AxiosResponse } from 'axios';

interface QuizData {
    userId: number;
    quizId: number;
    userName: string;
    userFirstName: string;
    userLastName: string;
    categoryId: number;
    avatar: string | null;
    accountType: string | null;
    quizName: string;
    rate: number;
    numberOfQuestions: number;
    createAt: string;
    view: number;
    timeRecentViewQuiz: string | null;
}

export default function ChartNewQuiz() {
    const [data, setData] = useState<QuizData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse<QuizData[]> = await axios.get('http://localhost:8080/api/v1/quiz/get-all-quiz');
                const sortedData = response.data.sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime());
                setData(sortedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const dailyQuizData: Record<string, number> = {};

    data.forEach((quiz) => {
        const date = new Date(quiz.createAt).toLocaleDateString('en-GB');
        dailyQuizData[date] = (dailyQuizData[date] || 0) + 1;
    });

    const transformedData = Object.entries(dailyQuizData).map(([date, count]) => ({
        date,
        Quiz: count,
    }));

    return (
        <div>
            <div style={{ textAlign: "center", fontSize: '1.5em', fontWeight: 'bold' }}>Number of Quizzes/day</div>
            <div style={{ maxHeight: '300px', maxWidth: '600px' }}>
                <LineChart
                    h={300}
                    data={transformedData}
                    dataKey="date"
                    series={[
                        { name: 'Quiz', color: 'teal.6' },
                    ]}
                    curveType="linear"
                />
            </div>
        </div>
    );
}
