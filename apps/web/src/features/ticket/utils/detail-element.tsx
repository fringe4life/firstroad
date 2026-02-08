interface DetailElementProps {
  isDetail: boolean;
  element: React.ReactNode;
  elementIfIsDetail: React.ReactNode;
}

const selectDetailElement = ({
  isDetail,
  element,
  elementIfIsDetail,
}: DetailElementProps) => (isDetail ? elementIfIsDetail : element);

export { selectDetailElement };
