import { ContentLayout, Header } from '@cloudscape-design/components';
import EmployeeTable from '../components/EmployeeTable';

export default function Home() {
  return (
    <ContentLayout header={<Header variant="h1">회사 ADMIN</Header>}>
      <EmployeeTable />
    </ContentLayout>
  );
}
