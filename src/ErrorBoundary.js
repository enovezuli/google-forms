import React, { Component } from 'react'

// Define a fallback component
const FallbackComponent = () => <div>Something went wrong.</div>

class ErrorBoundary extends Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError () {
    // Update state to show the fallback UI
    return { hasError: true }
  }

  componentDidCatch (error, info) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, info)
  }

  render () {
    if (this.state.hasError) {
      // Render the fallback UI
      return <FallbackComponent />
    }

    // Render the children components
    return this.props.children
  }
}

export default ErrorBoundary
