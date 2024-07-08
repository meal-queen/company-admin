import { FC, useEffect, useState } from 'react';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Header from '@cloudscape-design/components/header';
import Pagination from '@cloudscape-design/components/pagination';
import axios from 'axios';
import { getCookie } from '../utils/cookies';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Input } from '@cloudscape-design/components';
import qs from 'query-string';

const EmployeeTable: FC = () => {
  const [data, setData] = useState<any>();
  const [point, setPoint] = useState<{ [key: string]: string }>({});
  const location = useLocation();
  const query = qs.parse(location.search);
  // const [value, setValue] = useState('');

  const { page } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = getCookie('auth_token');

    if (!authToken) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          import.meta.env.VITE_BACKEND + 'auth/@me',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const company = userResponse.data.company;

        if (!company) {
          navigate('/0');
          return;
        }

        const queryResponse = await axios.get(
          `http://meal-queen.kro.kr/api/company/users?page=${
            page ?? 0
          }&take=10&company=${query.company}&role=${query.role ?? 'ROLE_USER'}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        setData(queryResponse.data.data);
      } catch (error) {
        navigate('/');
      }
    };

    fetchUserData();
  }, [page, navigate]);

  const handlePoint = async ({
    company,
    author,
    point,
  }: {
    company: string;
    author: string;
    point: number;
  }) => {
    try {
      const pointResponse = await axios.put(
        `http://meal-queen.kro.kr/api/company/author/point?company=${
          query.company
        }&author=${getCookie('auth_token')}`,
        {
          company: company,
          author: author,
          point: point,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('auth_token')}`,
          },
        }
      );
      setPoint(pointResponse.data.data);
    } catch (error) {
      console.error('Error updating point:', error);
    }
  };

  const handleInputChange = (uuid: string, value: string) => {
    setPoint((prevState) => ({
      ...prevState,
      [uuid]: value,
    }));
  };

  return (
    <>
      {!data ? (
        <></>
      ) : (
        <Table
          columnDefinitions={[
            {
              id: 'uuid',
              header: 'uuid',
              cell: (item: any) => item.uuid,
            },
            {
              id: 'point',
              header: 'point',
              cell: (item: any) => item.point,
            },
            {
              id: 'employee',
              header: '직원 리스트',
              cell: (item: any) => (
                <Box>
                  <Input
                    onChange={({ detail }) =>
                      handleInputChange(item.uuid, detail.value)
                    }
                    value={point[item.uuid] || ''}
                    autoFocus
                    placeholder="Enter point"
                  />
                  <Button
                    onClick={() => {
                      handlePoint({
                        company: item.company,
                        author: item.author,
                        point: Number(point[item.uuid]),
                      });
                    }}
                  >
                    {item.name} 직원
                  </Button>
                </Box>
              ),
              minWidth: 170,
            },
          ]}
          loadingText="Loading resources"
          empty={
            <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No resources</b>
              </SpaceBetween>
            </Box>
          }
          header={
            <Header
              counter={
                data.content.length
                  ? '(' + data.content.length + '/10)'
                  : '(10)'
              }
            >
              가입 회사 리스트
            </Header>
          }
          items={data.content}
          pagination={
            <Pagination
              currentPageIndex={Number(page)}
              pagesCount={data.totalPages - 1}
              onChange={(e) =>
                navigate(
                  `/${
                    e.detail.currentPageIndex < 0 || !e.detail.currentPageIndex
                      ? 0
                      : e.detail.currentPageIndex
                  }`
                )
              }
            />
          }
        />
      )}
    </>
  );
};

export default EmployeeTable;
