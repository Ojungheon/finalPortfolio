package com.dolearndorun.workerheal_app.common.home;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/home/")
@Slf4j
public class PackageController {
    private final PackageService packageService;

    @GetMapping("random")
    public List<PackageVo> getRandomPackages() {
        return packageService.getRandomPackages();
    }
}
