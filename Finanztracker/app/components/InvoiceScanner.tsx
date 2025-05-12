import React, { useState } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import TextRecognition from '@react-native-ml-kit/text-recognition';

async function extractTextFromImage(uri: string): Promise<string> {
    const result = await TextRecognition.recognize(uri);
    console.log('Text Recognition Result:', result);
    return result.text;
}

function parseInvoiceData(text: string) {
    const total = text.match(/total[:\s]*\$?(\d+[\.,]?\d{0,2})/i)?.[1];
    const date = text.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/)?.[0];
    const invoiceNumber = text.match(/invoice\s*(number|#)?:?\s*(\w+)/i)?.[2];
    const vendor = text.match(/(?:from|vendor)[:\s]*(.+)/i)?.[1];

    return { total, date, invoiceNumber, vendor };
}

const InvoiceScanner = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [facing, setFacing] = useState<CameraType>('back');

    if (!permission) {
        return <View />; // Camera permissions are still loading.
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const handleCapture = async () => {
        const photo = await cameraRef.current.takePictureAsync();
        setImageUri(photo.uri);
        const text = await extractTextFromImage(photo.uri);
        const parsed = parseInvoiceData(text);
        setResult(parsed);
        console.log('Extracted Text:', text);
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    return (
        <View style={styles.container}>
            {!imageUri ? (
                <CameraView style={styles.camera} facing={facing}>
                    <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                        <Text style={styles.flipText}>Flip Camera</Text>
                    </TouchableOpacity>
                    <Button title="Capture Invoice" onPress={handleCapture} />
                </CameraView>
            ) : (
                <Image source={{ uri: imageUri }} style={{ flex: 1 }} />
            )}

            {result && (
                <View>
                    <Text>Invoice Data:</Text>
                    <Text>Total: {result.total}</Text>
                    <Text>Date: {result.date}</Text>
                    <Text>Invoice #: {result.invoiceNumber}</Text>
                    <Text>Vendor: {result.vendor}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    flipButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
    },
    flipText: {
        fontSize: 18,
        color: 'white',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
});

export default InvoiceScanner;
