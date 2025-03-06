import React from 'react';
import './BreadcrumbNavigator.css';

interface BreadcrumbNavigatorProps {
    breadcrumbs: { text: string, path?: string }[];
}

const BreadcrumbNavigator: React.FC<BreadcrumbNavigatorProps> = ({ breadcrumbs }) => {
    return (
            <div className="breadcrumbNav">
                {breadcrumbs.map((breadcrumb, index) => (
                    <a key={index} href={breadcrumb.path}>
                        <div>{breadcrumb.text} {(index != breadcrumbs.length - 1)? ">" : ""}</div>
                    </a>
                ))}
            </div>

    );
};

export default BreadcrumbNavigator;