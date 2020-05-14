import * as React from 'react';
import useForceUpdate from 'use-force-update';
import createBrowserHistory from "history/createBrowserHistory";

export const history = createBrowserHistory();

export const HistoryContext = React.createContext(history);

export default () => {
  const forceUpdate: VoidFunction = useForceUpdate();
  const historyContext = React.useContext(HistoryContext);
  if (!historyContext) {
      throw new Error('outside context: useHistory');
  }
  React.useEffect(
    (): VoidFunction =>
      historyContext.listen(forceUpdate),
    [ historyContext ]
  );
  return historyContext;
};
