import React from 'react';
import {Link} from "react-router-dom";

interface NavOption {
    value: string;
    path: string;
}

interface TabsNavigationProps {
    options: NavOption[]
}


const TabsNavigation: React.FC<TabsNavigationProps> = ({options}) => {
    return (
        <div className="ml-60 mt-1">
            <nav className="flex">
                {options.map((option, index) => (
                    <div>
                        <Link to={option.path} key={index} className="uppercase text-sm font-medium text-black">
                            {option.value}
                        </Link>
                        {index < options.length - 1 && (
                            <span className="ml-2 mr-2">|</span>
                        )}
                    </div>
                ))}
            </nav>
            <div className="border-b border-black w-260 mb-4"></div>
        </div>
    );
};

export default TabsNavigation;