export interface mfaModel {
    Code: number,
    CardTitle: String,
    CardContent: String,
    Service: String,
    ImageObject: Image
}

export interface Image {
    smallImageUrl: String,
    largeImageUrl: String
}