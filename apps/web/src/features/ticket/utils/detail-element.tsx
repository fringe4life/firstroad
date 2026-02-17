interface DetailElementProps {
  element: React.ReactNode;
  elementIfIsDetail: React.ReactNode;
  isDetail: boolean;
}

const selectDetailElement = ({
  isDetail,
  element,
  elementIfIsDetail,
}: DetailElementProps) => (isDetail ? elementIfIsDetail : element);

export { selectDetailElement };
