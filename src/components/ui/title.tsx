interface TitleProps {
  title: string
}

const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="mb-5 text-2xl font-medium">{title}</h1>
    </div>
  )
}

export default Title
