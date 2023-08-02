import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Fragment, useEffect } from "react";
import { createBrowserHistory } from "history";
import { publicRoutes } from "./routes";
import { useDispatch } from "react-redux";
import { updateSize } from "./store/slices/generalSlice";

function App() {
  const history = createBrowserHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    function handleWindowResize() {
      dispatch(updateSize({ height: window.innerHeight, width: window.innerWidth }));
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [dispatch]);

  return (
    <Router history={history}>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let childArr;

            let Layout = null;
            if (route.child !== undefined) {
              childArr = route.child;
            }
            if (route.layout) {
              Layout = route.layout;
            } else {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              >
                {childArr !== undefined &&
                  childArr.map((item, index) => {
                    const Child = item.component;
                    const ChildLayout = item.layout ? item.layout : Fragment;
                    return (
                      <Route
                        key={index}
                        path={item.path}
                        element={
                          <ChildLayout>
                            <Child />
                          </ChildLayout>
                        }
                      />
                    );
                  })}
              </Route>
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
