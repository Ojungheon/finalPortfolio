package com.dolearndorun.workerheal_app.common.home;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PackageService {
    private final PackageMapper packageMapper;
    public List<PackageVo> getRandomPackages() {
        return packageMapper.selectRandomPackages();
    }
}
