package com.dolearndorun.workerheal_app.util.date;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Component
public class DateTime {

    private static DateTimeFormatter dateFormatter;
    private static DateTimeFormatter timeFormatter;

    public static String dateChange(LocalDate localDate){
        // 데이터 포맷 변환 정하기
        dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");    // 출력 형식(날짜)

        // 데이터 포맷 변환 시켜주기
        String date = localDate.format(dateFormatter);

        return date;
    }

    public static String timeChange(LocalTime localTime){
        timeFormatter = DateTimeFormatter.ofPattern("HHmm");    // 출력 형식(시간)

        String time = localTime.format(timeFormatter);

        return time;
    }

    public static LocalDate dateList(String dateStr){
        dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date = LocalDate.parse(dateStr, dateFormatter);

        return date;
    }

    public  static LocalTime timeList(String timeStr){
        timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime time = LocalTime.parse(timeStr, timeFormatter);

        return time;
    }
}