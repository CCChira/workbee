interface HeadlessTableProps {}

function HeadlessTable({}: HeadlessTableProps) {
  return <></>;
}

export default HeadlessTable;

/*
 const changePage = (pageNumber: number) => {
    console.log(`selectedPage: ${selectedPage}, changePageNumber: ${pageNumber}, currentPages: ${currentPages}`);
    if (pageNumber !== selectedPage) setSelectedPage(pageNumber);
    if (pageNumber === 1) {
      setCurrentPages([1, 2, 3]);
    }
    const newPages = [pageNumber - 1, pageNumber, pageNumber + 1];
    setCurrentPages(newPages);
  };
 */
