import React, { useRef, useContext } from 'react'
import ServiceContext from '../services/ServiceContext'
import Github from '../services/Github'

interface Props {
    service: Github;
}

const ServiceProvider: React.FC<Props> = ({ children, service }) => {
    const serviceRef = useRef(service).current;
    return (
        <ServiceContext.Provider value={serviceRef}>
            {children}
        </ServiceContext.Provider>
    )
}

export const useService = () => {
    return useContext(ServiceContext);
}

export default ServiceProvider
