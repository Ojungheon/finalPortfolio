package com.dolearndorun.workerheal_app.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

public class FileUtil {

    // 랜덤 파일명 생성
    public static String generateRandomName(){
        String str = UUID.randomUUID().toString();
        return System.currentTimeMillis()+"_"+str;
    }//generateRandomName

    /**
     * AWS S3 서버로 파일 저장
     * @param file
     * @param s3
     * @param bucket
     * @return file url
     * @throws IOException
     */
    public static String[] uploadFileToAwsS3(MultipartFile file, AmazonS3 s3,String bucket) throws IOException {

        // 업로드 파일의 랜덤 파일명 생성 (+파일 확장자 추가)
        String randomName = generateRandomName()+file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));

        // 추가정보(metaData) 생성
        ObjectMetadata metaData = new ObjectMetadata();
        metaData.setContentType(file.getContentType());
        metaData.setContentLength(file.getSize());

        // s3로 파일 전송
        s3.putObject(bucket,randomName,file.getInputStream(),metaData); // s3.putObject(버킷,이름,파일,추가정보);

        // 업로드한 파일의 Url 반환
        String[] returnArr = {randomName,s3.getUrl(bucket,randomName).toString()};
        return returnArr;

    }//uploadFileToAwsS3

    //AWS S3 파일 삭제 기능
    public static void deleteFileFromAwsS3(AmazonS3 s3, String bucket, String fileName) {
        s3.deleteObject(bucket, fileName);
    }

}//class
