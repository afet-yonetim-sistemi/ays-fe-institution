interface TitleProps {
  title: string
}

const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <h1 className="text-2xl font-medium mb-5">{title}</h1>
    </div>
  )
}

export default Title
