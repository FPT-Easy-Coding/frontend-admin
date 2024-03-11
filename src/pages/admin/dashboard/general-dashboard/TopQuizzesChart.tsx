import { useEffect, useState } from 'react';
import axios from 'axios';
import { Text, Table } from '@mantine/core';

interface QuizDataItem {
    id: number;
    rate: number;
    quizName: string;
}

const TopQuizzesChart = () => {
    const [top3QuizData, setTop3QuizData] = useState<QuizDataItem[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/quiz/get-all-quiz')
            .then(response => {
                const sortedData = response.data.sort((a: { rate: number; }, b: { rate: number; }) => b.rate - a.rate);
                const top3QuizData = sortedData.slice(0, 3);
                setTop3QuizData(top3QuizData);
            })
            .catch(error => {
                console.error('Error fetching quiz data:', error);
            });
    }, []);

    return (
        <div style={{ width: '97%', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginLeft: '10px' }}>
            <div style={{ padding: '20px' }}>
                <Text fz="lg" mb="sm" ta="center" style={{ fontWeight: 700 }}>
                    Top 3 Quizzes with the Highest Rates
                </Text>
            </div>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Quiz Name</Table.Th>
                        <Table.Th>Rate</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {top3QuizData.map((quiz, index) => (
                        <Table.Tr key={index} style={{ fontSize: index === 0 ? '1.2rem' : '1rem', fontWeight: index === 0 ? 700 : 400 }}>
                            <Table.Td>{quiz.quizName}</Table.Td>
                            <Table.Td>{quiz.rate}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </div>
    );
};

export default TopQuizzesChart;
