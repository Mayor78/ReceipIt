import { useEffect } from "react";

const usePageMeta = (title, description) => {
  useEffect(() => {
    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [title, description]);
};

export default usePageMeta;
