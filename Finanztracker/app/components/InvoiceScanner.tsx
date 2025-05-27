import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import Axios from 'axios';
import * as FileSystem from 'expo-file-system';

const url = 'https://prod-139.westeurope.logic.azure.com:443/workflows/945916bedc254b59bd70b901b6899a33/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8w3PpOPQV1Zl1_bmk1u4iNO1q2SXt0wInoVhGjGnWzo';

const InvoiceScanner = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [facing, setFacing] = useState<CameraType>('back');
    const cameraRef = useRef<Camera>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState<{ uri: string } | null>(null);
    const [formData, setFormData] = useState<{ [key: string]: any }>({});

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.centered}>
                <Text style={styles.message}>We need your permission to use the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    };

    const handleCapture = async () => {
        if (!cameraRef.current) return;
        try {
            setIsLoading(true);
            const photo = await cameraRef.current.takePictureAsync();
            setCapturedPhoto(photo);
            const data = await extractInvoiceData(photo.uri);
            setImageUri(photo.uri);
            setResult(data);
            setFormData({
                invoiceId: data.invoiceId || '',
                vendorName: data.vendor?.name || '',
                vendorAddress: data.vendor?.address || '',
                customerName: data.customer?.name || '',
                customerAddress: data.customer?.address || '',
                invoiceDate: data.invoiceDate || '',
                dueDate: data.dueDate || '',
                currency: data.currency || '',
                totalAmount: data.totalAmount || '',
                lineItems: data.lineItems || [],
            });
        } catch (error) {
            console.error('Capture failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const extractInvoiceData = async (uri: string) => {
        try {
            const fileName = uri.split('/').pop() || 'image.jpg';

            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const payload = {
                fileName: fileName,
                fileContent: base64,
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('Upload error:', error);
                return { error };
            } else {
                const result = await response.json();
                console.log('Upload successful:', result);
                return result;
            }
        } catch (error) {
            console.error('Error processing image:', error);
            return { error: error.message || 'Unknown error' };
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        const structured = {
            invoiceId: formData.invoiceId,
            vendor: {
                name: formData.vendorName,
                address: formData.vendorAddress,
            },
            customer: {
                name: formData.customerName,
                address: formData.customerAddress,
            },
            invoiceDate: formData.invoiceDate,
            dueDate: formData.dueDate,
            currency: formData.currency,
            totalAmount: formData.totalAmount,
            lineItems: formData.lineItems,
        };

        console.log('Submitted structured data:', structured);    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 4, backgroundColor: "#00FF7F" }} />
            <View style={{ flex: 6, backgroundColor: "#222222" }} />

            <View style={styles.whiteContainer}>
                {(!imageUri || isLoading) ? (
                    <View style={styles.full}>
                        {capturedPhoto && !imageUri ? (
                            <Image source={{ uri: capturedPhoto.uri }} style={styles.camera} />
                        ) : (
                            <CameraView
                                ref={cameraRef}
                                style={styles.camera}
                                facing={facing}
                            />
                        )}

                        {isLoading && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color="#00FF7F" />
                                <Text style={styles.loadingText}>Verarbeite Bild...</Text>
                            </View>
                        )}

                        <View style={styles.controls}>
                            <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
                                <Text style={styles.iconButtonText}>Flip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.captureMainButton} onPress={handleCapture}>
                                <Text style={styles.captureText}>Capture</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                ) : (
                    <ScrollView style={styles.scrollContent}>
                        <Image source={{ uri: imageUri }} style={styles.preview} />
                        <TouchableOpacity style={styles.iconButton} onPress={() => {
                            setImageUri(null);
                            setResult(null);
                            setCapturedPhoto(null);
                        }}>
                            <Text style={styles.iconButtonText}>Retake</Text>
                        </TouchableOpacity>

                        {formData && Object.keys(formData).length > 0 && (
                            <View style={styles.formContainer}>
                                <Text style={styles.resultTitle}>Bearbeite Rechnungsdaten:</Text>

                                {[
                                    { label: 'Invoice ID', key: 'invoiceId' },
                                    { label: 'Vendor Name', key: 'vendorName' },
                                    { label: 'Vendor Address', key: 'vendorAddress' },
                                    { label: 'Customer Name', key: 'customerName' },
                                    { label: 'Customer Address', key: 'customerAddress' },
                                    { label: 'Invoice Date', key: 'invoiceDate' },
                                    { label: 'Due Date', key: 'dueDate' },
                                    { label: 'Currency', key: 'currency' },
                                    { label: 'Total Amount', key: 'totalAmount' },
                                ].map(({ label, key }) => (
                                    <View key={key} style={styles.formField}>
                                        <Text style={styles.fieldLabel}>{label}</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={formData[key]}
                                            onChangeText={(text) => handleInputChange(key, text)}
                                        />
                                    </View>
                                ))}

                                {/* Line Items */}
                                {formData.lineItems && formData.lineItems.length > 0 && (
                                    <View style={{ marginTop: 20 }}>
                                        <Text style={[styles.resultTitle, { marginBottom: 10 }]}>Line Items:</Text>
                                        {formData.lineItems.map((item: any, index: number) => (
                                            <View key={index} style={{ marginBottom: 15 }}>
                                                <Text style={styles.fieldLabel}>Item {index + 1}</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Description"
                                                    value={item.description || ''}
                                                    onChangeText={(text) => {
                                                        const updated = [...formData.lineItems];
                                                        updated[index] = { ...updated[index], description: text };
                                                        handleInputChange('lineItems', updated);
                                                    }}
                                                />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Amount"
                                                    value={String(item.amount || '')}
                                                    keyboardType="decimal-pad"
                                                    onChangeText={(text) => {
                                                        const updated = [...formData.lineItems];
                                                        updated[index] = { ...updated[index], amount: parseFloat(text) || 0 };
                                                        handleInputChange('lineItems', updated);
                                                    }}
                                                />
                                            </View>
                                        ))}
                                    </View>
                                )}

                                <TouchableOpacity style={styles.captureMainButton} onPress={handleSubmit}>
                                    <Text style={styles.captureText}>Submit</Text>
                                </TouchableOpacity>
                            </View>

                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: { flex: 1 },
    full: { flex: 1 },
    scrollContent: {
        flex: 1,
        padding: 16,
    },
    camera: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    whiteContainer: {
        position: 'absolute',
        top: '15%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    preview: {
        width: '90%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 16,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
        backgroundColor: '#fff',
    },
    controls: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
    },
    iconButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    iconButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    captureMainButton: {
        backgroundColor: '#00FF7F',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    captureText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 12,
        color: '#333',
    },
    resultContainer: {
        marginTop: 20,
        backgroundColor: '#f4f4f4',
        padding: 16,
        borderRadius: 12,
    },
    resultTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 16,
    },
    json: {
        fontFamily: 'monospace',
        fontSize: 14,
        color: '#333',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    loadingText: {
        color: '#00FF7F',
        marginTop: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    formContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 4,
    },
    formField: {
        marginBottom: 15,
    },
    fieldLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#444',
    },
    input: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
    },

});


export default InvoiceScanner;
