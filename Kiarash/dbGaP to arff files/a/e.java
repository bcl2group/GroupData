package a;

import b.a;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintStream;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.FileChannel.MapMode;

public final class e
{
  private Integer a = new Integer(0);
  private int b = 0;

  public final void a()
  {
    long l1 = Runtime.getRuntime().totalMemory();
    System.out.println("Total Memory: " + l1 / a.a + " Mb");
    try
    {
      FileChannel localFileChannel1 = new FileInputStream(a.q).getChannel();
      FileChannel localFileChannel2 = new RandomAccessFile(a.u, "rw").getChannel();
      long l3 = 0L;
      double d = localFileChannel1.size() / a.a / 1024L;
      System.out.printf("file size: %.2f GB\n", new Object[] { Double.valueOf(d) });
      System.out.printf("total block count: %d\n*****************\n", new Object[] { Integer.valueOf((int)(localFileChannel1.size() / a.B) + 1) });
      int i = 0;
      if (localFileChannel1.size() / a.a > 30L)
        while ((l3 < localFileChannel1.size()) && (localFileChannel1.size() - l3 > a.B))
        {
          i++;
          a(i, localFileChannel1, localFileChannel2, l3, a.B);
          l3 += a.B;
        }
      a(i, localFileChannel1, localFileChannel2, l3, localFileChannel1.size() - l3);
      localFileChannel1.close();
      localFileChannel2.close();
    }
    catch (FileNotFoundException localFileNotFoundException)
    {
      System.out.println("FileNotFoundException in readByMappedByteBuffer from RawToArffFast.java");
    }
    catch (IOException localIOException)
    {
      System.out.println("IOException in readByMappedByteBuffer from RawToArffFast.java");
    }
    long l2 = Runtime.getRuntime().totalMemory();
    System.out.println("Total Memory: " + l2 / a.a + " Mb");
  }

  private String a(String paramString)
  {
    System.out.println("start extracting headers");
    StringBuffer localStringBuffer;
    (localStringBuffer = new StringBuffer("")).append("@relation " + a.z + "\n\n");
    int i = paramString.indexOf('\n');
    String str1 = paramString.substring(0, i);
    String str2 = "@attribute ";
    String str3 = " string";
    String str4 = " { 0, 1, 2 }";
    int j = str1.length();
    while ((k = str1.indexOf(',')) != -1)
    {
      String str5 = str1.substring(0, k);
      str1 = str1.substring(k + 1);
      this.b += 1;
      if ((str5.trim().equalsIgnoreCase("FID")) || (str5.trim().equalsIgnoreCase("IID")))
      {
        localStringBuffer.append(str2);
        localStringBuffer.append(str5);
        localStringBuffer.append(str3);
        localStringBuffer.append('\n');
        continue;
      }
      localStringBuffer.append(str2);
      localStringBuffer.append(str5);
      localStringBuffer.append(str4);
      localStringBuffer.append('\n');
    }
    localStringBuffer.append("\n@data");
    int k = localStringBuffer.length();
    localStringBuffer.append(paramString.substring(i));
    this.a = Integer.valueOf(k - j);
    System.out.println("total attribute count: " + this.b);
    System.out.println("finish extracting headers with extra bit: " + this.a);
    return localStringBuffer.toString();
  }

  private void a(int paramInt, FileChannel paramFileChannel1, FileChannel paramFileChannel2, long paramLong1, long paramLong2)
  {
    try
    {
      System.out.printf("start processing block No.%d\n", new Object[] { Integer.valueOf(paramInt) });
      if ((a.b = Runtime.getRuntime().freeMemory()) / a.a < 5L)
      {
        System.out.println("Memory is not enough. Only left: " + a.b);
        return;
      }
      paramFileChannel1 = (paramFileChannel1 = (paramFileChannel1 = a.a(paramFileChannel1 = paramFileChannel1.map(FileChannel.MapMode.READ_ONLY, paramLong1, paramLong2))).replace(' ', ',')).replace("NA", "?");
      if (paramInt == 1)
        paramFileChannel1 = a(paramFileChannel1);
      paramFileChannel1 = a.a(paramFileChannel1);
      if (paramInt == 1)
        paramInt = paramFileChannel2.map(FileChannel.MapMode.READ_WRITE, paramLong1, paramLong2 + this.a.intValue());
      else
        paramInt = paramFileChannel2.map(FileChannel.MapMode.READ_WRITE, paramLong1, paramLong2);
      paramInt.put(paramFileChannel1);
      paramFileChannel1.clear();
      paramInt.clear();
      return;
    }
    catch (IOException paramFileChannel1)
    {
      System.out.println("IOException in processAndWriteData from RawToArffFast.java");
    }
  }
}

/* Location:           C:\Downloads\Project\MyEclipse\pipeline.jar
 * Qualified Name:     a.e
 * JD-Core Version:    0.6.0
 */