import ChartNewQuiz from "./ChartNewQuiz";
import ChartNewUser from "./ChartNewUser";
import { Paper } from '@mantine/core';
import QuizDonutChart from "./DonutChart";
import TopQuizzesChart from "./TopQuizzesChart";
export default function GeneralDashboard() {
    return (
        <div style={{ backgroundColor: "#f5f5f5" }}>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 6 }}>
                    <Paper style={{ padding: '20px', margin: '10px' }}>
                        <ChartNewUser />
                    </Paper>
                </div>
                <div style={{ flex: 6 }}>
                    <Paper style={{ padding: '20px', margin: '10px' }}>
                        <ChartNewQuiz />
                    </Paper>
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 4 }}>
                    <QuizDonutChart />
                </div>
                <div style={{ flex: 8 }}>
                    <TopQuizzesChart />
                </div>
            </div>
        </div>
    )
}