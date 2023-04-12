import { useRef } from 'react';
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import DataTable, { initialRows } from './data/DataTable';

const IndexPage = () => {
  const tableRef = useRef({
    name: undefined,
    setName: () => {},
  });

  console.log(initialRows);

  return (
    <div>
      <DataTable rows={initialRows} ref={tableRef} />
    </div>
  );
};

const SecondPage = () => {
  const tableRef = useRef({
    name: undefined,
    setName: () => {},
  });
  /**
   * NOTE:
   * useImperativeHandle의 효능:
   * 부모 컴포넌트 SecondPage에서 자식 컴포넌트 DataTable의
   * state나 handler함수등을 referece 로 가져와서 사용할 수 있다.
   * 즉 자식코드에서 정의하고 부모코드서 사용하니, 부모코드에서 코드가 간결해 질 수 있음.
   */
  console.log('SecondPage: ', tableRef.current);

  return (
    <div>
      <DataTable rows={initialRows} ref={tableRef} />
    </div>
  );
};

const Layout = () => {
  const navigate = useNavigate();
  return (
    <>
      <div onClick={() => navigate('/')}>go '/'</div>
      <div onClick={() => navigate('/2')}>go '/2'</div>
      <Outlet />
    </>
  );
};

function App_useImperativeHandle() {
  return (
    <div className="App_useImperativeHandle">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<IndexPage />} />
            <Route path="/2" element={<SecondPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App_useImperativeHandle;
