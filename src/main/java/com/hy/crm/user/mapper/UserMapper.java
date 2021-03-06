package com.hy.crm.user.mapper;

import com.hy.crm.user.pojo.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 * 用户表 Mapper 接口
 * </p>
 *
 * @author zzx
 * @since 2020-08-29
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

}
