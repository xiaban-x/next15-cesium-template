'use client'

import dynamic from 'next/dynamic'
import React, {useEffect, useState} from 'react';
import type { CesiumType } from '@/app/_types/cesium';
import type { Position } from '@/app/_types/position';

const CesiumDynamicComponent = dynamic(() => import('./CesiumComponent'), {
    ssr: false
});

export const CesiumWrapper:React.FunctionComponent<{
    positions: Position[]
}> = ({
    positions
}) => {
    const [CesiumJs, setCesiumJs] = useState<CesiumType | null>(null);
    
    useEffect(() => {
        if (CesiumJs !== null) return
        const CesiumImportPromise = import('cesium');
        Promise.all([CesiumImportPromise]).then((promiseResults) => {
            const { ...Cesium } = promiseResults[0];
            setCesiumJs(Cesium);
        });
    }, [CesiumJs]);

    return (
        CesiumJs ? <CesiumDynamicComponent CesiumJs={CesiumJs} positions={positions} /> : null
    )
}

export default CesiumWrapper;