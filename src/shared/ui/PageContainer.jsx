function PageContainer({ title, subtitle, actions, children }) {
  return (
    <main className="page-container">
      <header className="page-header">
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </header>
      {children}
    </main>
  )
}

export default PageContainer
