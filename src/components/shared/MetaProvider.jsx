import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMatches } from "react-router-dom";

import MetaTags from "./MetaTags";

const MetaContext = createContext(null);

export const MetaProvider = ({ children }) => {
  const [pageMeta, setPageMeta] = useState(null);

  const value = useMemo(
    () => ({
      setPageMeta,
    }),
    []
  );

  return (
    <MetaContext.Provider value={value}>
      <RouteMeta pageMeta={pageMeta?.meta} />
      {children}
    </MetaContext.Provider>
  );
};

const RouteMeta = ({ pageMeta }) => {
  const matches = useMatches();

  const routeMeta = [...matches]
    .reverse()
    .find((match) => match.handle?.meta)?.handle.meta;

  return <MetaTags {...(pageMeta || routeMeta)} />;
};

const PageMeta = ({ description, image, noIndex, title, type }) => {
  const context = useContext(MetaContext);
  const idRef = useRef(Symbol("page-meta"));
  const meta = useMemo(
    () => ({ description, image, noIndex, title, type }),
    [description, image, noIndex, title, type]
  );

  useEffect(() => {
    if (!context) return undefined;

    const id = idRef.current;
    context.setPageMeta({ id, meta });

    return () => {
      context.setPageMeta((currentMeta) =>
        currentMeta?.id === id ? null : currentMeta
      );
    };
  }, [context, meta]);

  return null;
};

export default PageMeta;
