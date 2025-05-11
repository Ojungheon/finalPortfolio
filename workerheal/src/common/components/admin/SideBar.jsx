import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 폰트 어썸 쓸거다
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import {
  ListSubheader,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:link {
  }
`;

const menuList = [
  {
    no: 0,
    name: '패키지',
    submenu: [
      {
        no: 1,
        subName: '패키지 목록',
        goto: '/manager/package/list',
      },
      {
        no: 2,
        subName: '패키지 등록',
        goto: '/manager/enroll/package/lodging/list',
      },
    ],
  },
  {
    no: 1,
    name: '사업장',
    submenu: [
      {
        no: 1,
        subName: '오피스 관리',
        goto: '/manager/office/list',
      },
      {
        no: 2,
        subName: '숙소 관리',
        goto: '/manager/lodging/list',
      },
      {
        no: 3,
        subName: '승인 요청 목록',
        goto: '/manager/approval/list',
      },
    ],
  },
  {
    no: 2,
    name: '관광지',
    submenu: [
      {
        no: 1,
        subName: '관광지 목록',
        goto: '/manager/tour/list',
      },
      {
        no: 2,
        subName: '관광지 등록',
        goto: '/manager/tour/enroll',
      },
    ],
  },
  {
    no: 3,
    name: '회원 관리',
    submenu: [
      {
        no: 1,
        subName: '회원 목록',
        goto: '/manager/member/list',
      },
      {
        no: 2,
        subName: '예약내역 조회',
        goto: '/manager/member/reservation',
      },
    ],
  },
  {
    no: 4,
    name: '호스트 관리',
    submenu: [
      {
        no: 1,
        subName: '호스트 목록',
        goto: '/manager/host/list',
      },
      {
        no: 2,
        subName: '호스트 계정생성',
        goto: '/manager/host/enroll',
      },
    ],
  },
  {
    no: 5,
    name: 'FAQ',
    submenu: [
      {
        no: 1,
        subName: 'FAQ 목록',
        goto: '/manager/faq/list',
      },
      {
        no: 2,
        subName: 'FAQ 등록',
        goto: '/manager/faq/enroll',
      },
    ],
  },
];

const SideBar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState([false, false, false, false, false, false]);

  const handleClick = (num) => {
    setOpen((prev) => {
      const prevOpen = [...prev]; // 기존 배열을 복사하여 새로운 배열 생성

      const newOpen = [false, false, false, false, false, false];
      newOpen[num] = !prevOpen[num];
      // 클릭한 항목의 상태를 변경

      return newOpen;
    });
  };

  return (
    <List
      // sx={{ width: '100%', maxWidth: 180, bgcolor: 'background.paper' }}
      sx={{
        width: '100%',
        height: 852,
        maxWidth: 180,
        bgcolor: '#6d4c41',
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      // subheader={
      //   <ListSubheader component="div" id="nested-list-subheader">
      //     Nested List Items
      //   </ListSubheader>
      // }
    >
      {menuList.map((menu) => {
        return (
          <>
            <ListItemButton
              key={menu.name}
              onClick={() => handleClick(menu.no)}
              sx={{ pl: 0 }}
            >
              <ListItemIcon>{/* <InboxIcon /> */}</ListItemIcon>
              <ListItemText primary={menu.name} sx={{ color: 'white' }} />
              {open[menu.no] ? (
                <FontAwesomeIcon
                  icon={faAngleUp}
                  style={{ color: '#ffffff' }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faAngleDown}
                  style={{ color: '#ffffff' }}
                />
              )}
            </ListItemButton>
            <Collapse in={open[menu.no]} timeout="auto" unmountOnExit>
              {menu.submenu.map((subMenu) => {
                return (
                  <>
                    <List key={subMenu.subName} component="div" disablePadding>
                      <ListItemButton sx={{ pl: 0, bgcolor: '#8d6e63' }}>
                        <ListItemIcon>{/* <StarBorder /> */}</ListItemIcon>
                        <StyledLink to={subMenu.goto}>
                          <ListItemText
                            primary={subMenu.subName}
                            primaryTypographyProps={{ fontSize: '0.9rem' }}
                          />
                        </StyledLink>
                      </ListItemButton>
                    </List>
                  </>
                );
              })}
            </Collapse>
          </>
        );
      })}
    </List>
  );
};

export default SideBar;
