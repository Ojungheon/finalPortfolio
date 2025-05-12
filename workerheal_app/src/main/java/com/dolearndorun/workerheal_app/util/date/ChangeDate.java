package com.dolearndorun.workerheal_app.util.date;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class ChangeDate {
    private static DateTimeFormatter inputFormatter = null;
    private static DateTimeFormatter outputFormatter = null;

    public static String changeDate(String x){
        inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        outputFormatter = DateTimeFormatter.ofPattern("yy.MM.dd");
        LocalDate parse = LocalDate.parse(x, inputFormatter);
        String date = parse.format(outputFormatter);
        return date;
    }

    public static String changeDate1(String x){
        inputFormatter = DateTimeFormatter.ofPattern("yy.MM.dd");
        outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate parsedDate = LocalDate.parse(x, inputFormatter);
        String formattedDate = parsedDate.format(outputFormatter);
        return formattedDate;
    }

    public static String changeDate2(String x){
        inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        outputFormatter = DateTimeFormatter.ofPattern("yy.MM.dd");
        LocalDateTime parsedDate = LocalDateTime.parse(x, inputFormatter);
        String formattedDate = parsedDate.format(outputFormatter);
        return formattedDate;
    }
}