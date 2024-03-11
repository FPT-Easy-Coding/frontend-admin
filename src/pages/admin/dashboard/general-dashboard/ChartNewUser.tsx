import { useEffect, useState } from 'react';
import { LineChart } from '@mantine/charts';
import axios, { AxiosResponse } from 'axios';

interface UserData {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    createdAt: string; // Đảm bảo kiểu của createdAt là string
    avatar: string | null;
    accountType: string | null;
    role: string;
    banned: boolean;
    premium: boolean;
}

export default function ChartNewUser() {
    const [data, setData] = useState<UserData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse<UserData[]> = await axios.get('http://localhost:8080/api/v1/admin/users-dashboard');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const dailyUserData: Record<string, number> = {};

    data.forEach((user) => {
        const date = new Date(user.createdAt).toLocaleDateString('en-GB');
        dailyUserData[date] = (dailyUserData[date] || 0) + 1;
    });

    const sortedData = Object.entries(dailyUserData)
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([date, count]) => ({
            date,
            User: count,
        }));

    return (
        <div >
            <div style={{ textAlign: "center", fontSize: '1.5em', fontWeight: 'bold' }}>Number Of User/day</div>
            <div style={{ maxHeight: '300px', maxWidth: '600px' }}>
                <LineChart
                    h={300}
                    data={sortedData}
                    dataKey="date"
                    series={[
                        { name: 'User', color: 'teal.6' },
                    ]}
                    curveType="linear"
                />
            </div>
        </div>

    );
}
