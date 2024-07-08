import { BrowserRouter } from 'react-router-dom';
import {
  AppLayout,
  HelpPanel,
  SideNavigation,
} from '@cloudscape-design/components';
import I18nProvider from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.ko';
import { useState } from 'react';
import Routers from './components/router';

const LOCALE = 'ko';

function App() {
  const [navi, setNavi] = useState(true);
  const [helpPanel, setHelpPanel] = useState(false);

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      {window.location.pathname.startsWith('/auth/') ? (
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      ) : (
        <AppLayout
          navigationOpen={navi}
          onNavigationChange={() => setNavi((e) => (!e ? true : false))}
          navigation={
            <SideNavigation
              header={{ href: '/', text: '기능' }}
              items={[
                {
                  type: 'link',
                  text: '직원 리스트',
                  href: '/',
                },
              ]}
            />
          }
          toolsOpen={helpPanel}
          onToolsChange={() => setHelpPanel((e) => (!e ? true : false))}
          tools={<HelpPanel header={<h2>회사</h2>}>관리자 페이지</HelpPanel>}
          content={
            <BrowserRouter>
              <Routers />
            </BrowserRouter>
          }
        />
      )}
    </I18nProvider>
  );
}

export default App;
