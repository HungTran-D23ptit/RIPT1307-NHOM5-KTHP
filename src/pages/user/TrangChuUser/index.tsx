import { Layout, } from 'antd';
import WelcomeHeader from './components/WelcomeHeader';
import QuickActions from './components/QuickActions';
import StatsOverview from './components/StatsOverview';
import CurrentBorrowings from './components/CurrentBorrowings';
import EquipmentRecommendations from './components/EquipmentRecommendations';
import UsageTips from './components/UsageTips';
import ImportantReminder from './components/ImportantReminder';

const { Content } = Layout;

const TrangChuUser = () => {

  return (
    <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Content style={{ padding: '0 24px', margin: '0 auto', maxWidth: '1200px' }}>
        <WelcomeHeader />
        <QuickActions />
        <StatsOverview />
        <CurrentBorrowings />
        <ImportantReminder />
        <EquipmentRecommendations />
        <UsageTips />
       
      </Content>
    </Layout>
  );
};

export default TrangChuUser;