const generateDivs = (numDivs: number) => {
  const divs = [];
  for (let i = 0; i < numDivs; i++) {
    divs.push(<div key={i + 'dummyemptydiv'}></div>);
  }
  return divs;
};

export const EmptyDayGenerator = ({ numDivs }: { numDivs: number }) => {
  return <>{generateDivs(numDivs)}</>;
};
