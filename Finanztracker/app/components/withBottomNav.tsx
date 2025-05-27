import React from 'react';
import BottomNav from "@/app/components/bottomNav";

const withBottomNav = (Component: React.ComponentType<any>) => {
    return function WrappedWithNav(props: any) {
        return (
            <>
                <Component {...props} />
                <BottomNav navigation={props.navigation} />
            </>
        );
    };
};

export default withBottomNav;
