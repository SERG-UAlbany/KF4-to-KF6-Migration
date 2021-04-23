KBDeX To Retrieve data.json
=====
Git clone the reposiory and open it in eclipse.

#### To Get KF4 Data
Run KFDataExporter > Src > Kfl.kf4Serializer.app > KF4SerializerMain.java
Which will create a "communityFolder" in KFDataExporter > KF.out > "communityFolder"

#### To get Attachments from KF4
Run KFDataExporter > Src > Kfl.kf4Serializer.app > KF4AttachmentDownloaderMainTest.java
Which will create an attachments folder in KFDataExporter > KF.out > "communityFolder" > attachments

### To convert KF4 Data into KF6 Data
Run KFDataExporter > Src > Kfl.converter.kf6.app > K6ConverterMainTest.java
Note: In K6ConverterMainTest, Add the "communityFolder" name as a parameter
Now, You'll get desired output: data.json file in "communityFolder" 

### For Retrieving data to be imported in KF6 database, use SERG-UAlbany/kf6-tools-public
