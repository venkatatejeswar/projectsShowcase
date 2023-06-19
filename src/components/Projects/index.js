import {Component} from 'react'
import './index.css'
import Loader from 'react-loader-spinner'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
  initial: 'INITIAL',
}

class Projects extends Component {
  state = {
    projectsList: [],
    apiStatus: apiConstants.initial,
    category: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    const {category} = this.state
    this.setState({apiStatus: apiConstants.loading})
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const updatedProjects = data.projects.map(pro => ({
        id: pro.id,
        name: pro.name,
        imageUrl: pro.image_url,
      }))
      this.setState({
        projectsList: updatedProjects,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  changeCategory = e => {
    this.setState({category: e.target.value}, this.getProjects)
  }

  onRetry = () => {
    this.getProjects()
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#e2e8f0" width={50} height={50} />
    </div>
  )

  renderProjectsView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects_list">
        {projectsList.map(project => (
          <li className="project" key={project.id}>
            <img src={project.imageUrl} alt={project.name} className="image" />
            <p className="name">{project.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderFailure = () => (
    <div className="failure_container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure_img"
      />
      <h1 className="failure_title">Oops! Something Went Wrong</h1>
      <p className="failure_desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="retry_btn" type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.loading:
        return this.renderLoadingView()
      case apiConstants.success:
        return this.renderProjectsView()
      case apiConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {category} = this.state
    return (
      <div className="bg_container">
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </div>
        <div className="projects_container">
          <select
            className="categories"
            onChange={this.changeCategory}
            value={category}
          >
            {categoriesList.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.displayText}
              </option>
            ))}
          </select>
          {this.renderViews()}
        </div>
      </div>
    )
  }
}

export default Projects
