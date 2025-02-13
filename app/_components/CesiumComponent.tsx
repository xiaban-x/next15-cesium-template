'use client'

import React, {useCallback, useEffect, useRef, useState} from 'react'
import type {CesiumType} from '@/app/_types/cesium'
import {Cesium3DTileset, type Viewer} from 'cesium';
import type {Position} from '@/app/_types/position';
import 'cesium/Build/Cesium/Widgets/widgets.css';

export const CesiumComponent: React.FunctionComponent<{
    CesiumJs: CesiumType,
    positions: Position[]
}> = ({
          CesiumJs,
          positions
      }) => {
    const cesiumViewer = useRef<Viewer | null>(null);
    const cesiumContainerRef = useRef<HTMLDivElement>(null);
    const addedScenePrimitives = useRef<Cesium3DTileset[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const resetCamera = useCallback(async () => {
        // Set the initial camera to look at Seattle
        // No need for dependancies since all data is static for this example.
        if (cesiumViewer.current !== null) {
            cesiumViewer.current.scene.camera.setView({
                destination: CesiumJs.Cartesian3.fromDegrees(116.4074, 39.9042, 600), // 修改为你想要的经纬度和高度
                orientation: {
                    heading: CesiumJs.Math.toRadians(10),
                    pitch: CesiumJs.Math.toRadians(-10),
                },
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cleanUpPrimitives = React.useCallback(() => {
        //On NextJS 13.4+, React Strict Mode is on by default.
        //The block below will remove all added primitives from the scene.
        addedScenePrimitives.current.forEach(scenePrimitive => {
            if (cesiumViewer.current !== null) {
                cesiumViewer.current.scene.primitives.remove(scenePrimitive);
            }
        });
        addedScenePrimitives.current = [];
    }, []);

    const initializeCesiumJs = useCallback(async () => {
        if (cesiumViewer.current !== null) {
            //Using the Sandcastle example below
            //https://sandcastle.cesium.com/?src=3D%20Tiles%20Feature%20Styling.html
            const osmBuildingsTileset = await CesiumJs.createOsmBuildingsAsync();

            //Clean up potentially already-existing primitives.
            cleanUpPrimitives();

            const osmBuildingsTilesetPrimitive = cesiumViewer.current.scene.primitives.add(osmBuildingsTileset);
            addedScenePrimitives.current.push(osmBuildingsTilesetPrimitive);

            resetCamera();

            positions.forEach(p => {
                cesiumViewer.current?.entities.add({
                    position: CesiumJs.Cartesian3.fromDegrees(p.lng, p.lat),
                    ellipse: {
                        semiMinorAxis: 50000.0,
                        semiMajorAxis: 50000.0,
                        height: 0,
                        material: CesiumJs.Color.RED.withAlpha(0.5),
                        outline: true,
                        outlineColor: CesiumJs.Color.BLACK,
                    }
                });
            });

            //Set loaded flag
            setIsLoaded(true);
        }
    }, [CesiumJs, cleanUpPrimitives, positions, resetCamera]);

    useEffect(() => {
        if (cesiumViewer.current === null && cesiumContainerRef.current) {
            //OPTIONAL: Assign access Token here
            //Guide: https://cesium.com/learn/ion/cesium-ion-access-tokens/
            CesiumJs.Ion.defaultAccessToken = `${process.env.NEXT_PUBLIC_CESIUM_TOKEN}`;

            //NOTE: Always utilize CesiumJs; do not import them from "cesium"
            cesiumViewer.current = new CesiumJs.Viewer(cesiumContainerRef.current, {
                //Using the Sandcastle example below
                //https://sandcastle.cesium.com/?src=3D%20Tiles%20Feature%20Styling.html
                terrain: CesiumJs.Terrain.fromWorldTerrain()
            });

            // 修改 Home 按钮的行为
            const homeButton = cesiumViewer.current.homeButton;
            if (homeButton) {
                homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
                    // 自定义 Home 按钮的跳转位置
                    const homePosition = CesiumJs.Cartesian3.fromDegrees(116.4074, 39.9042, 10000000); // 北京的经纬度和高度
                    const homeOrientation = {
                        heading: CesiumJs.Math.toRadians(0),
                        pitch: CesiumJs.Math.toRadians(-90),
                        roll: 0,
                    };

                    // 使用 flyTo 平滑过渡到目标位置
                    cesiumViewer.current?.scene.camera.flyTo({
                        destination: homePosition,
                        orientation: homeOrientation,
                        duration: 3, // 平滑过渡时间（秒）
                    });

                    e.cancel = true; // 取消默认的行为
                });
            }


            //NOTE: Example of configuring a Cesium viewer
            cesiumViewer.current.clock.clockStep = CesiumJs.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isLoaded) return;
        initializeCesiumJs();

    }, [positions, isLoaded, initializeCesiumJs]);

    return (
        <div
            ref={cesiumContainerRef}
            id='cesium-container'
            style={{height: '100vh', width: '100vw'}}
        />
    )
}

export default CesiumComponent